import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MindMapNode, ProcessedNode, PillarCategory } from '../types';
import { sound } from '../utils/audio';
import { logCrash } from '../utils/crashLog';

interface ThreeCanvasProps {
  data: MindMapNode;
  selectedNode: MindMapNode | null;
  onSelectNode: (node: MindMapNode) => void;
  selectedCategory: PillarCategory;
  searchQuery: string;
  showLabels: boolean;
  cameraPresetTrigger?: { type: 'reset' | 'root' | 'top'; timestamp: number } | null;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  data,
  selectedNode,
  onSelectNode,
  selectedCategory,
  searchQuery,
  showLabels,
  cameraPresetTrigger
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);

  // References to keep across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const nodesArrayRef = useRef<ProcessedNode[]>([]);
  const linesArrayRef = useRef<THREE.Line[]>([]);
  const labelElementsRef = useRef<{ element: HTMLDivElement; node: ProcessedNode }[]>([]);
  const hoveredNodeRef = useRef<ProcessedNode | null>(null);
  const isAnimatingCamRef = useRef<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null);

  // When WebGL fails (or the GPU context is lost, common on phones), show the
  // real error on screen instead of a dead canvas — the message is what we
  // need to diagnose the device-specific cause.
  const [glError, setGlError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  // Flatten and calculate 3D radial coordinates
  const processHierarchy = (
    node: MindMapNode,
    depth = 0,
    angleRange = { min: 0, max: Math.PI * 2 },
    parentPos: ProcessedNode | null = null,
    outList: ProcessedNode[] = []
  ) => {
    const processed: ProcessedNode = {
      data: node,
      depth,
      x: parentPos ? parentPos.targetX : 0,
      y: parentPos ? parentPos.targetY : 0,
      z: parentPos ? parentPos.targetZ : 0,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      parent: parentPos
    };

    if (depth === 0) {
      processed.targetX = 0;
      processed.targetY = 0;
      processed.targetZ = 0;
    } else {
      // Cylindrical/spherical radial distribution
      const radius = depth === 1 ? 32 : depth === 2 ? 64 : 94;
      const midAngle = (angleRange.min + angleRange.max) / 2;
      const verticalVariation = Math.sin(midAngle * 3) * 16 + (depth * 5 - 12);

      processed.targetX = Math.cos(midAngle) * radius;
      processed.targetY = verticalVariation;
      processed.targetZ = Math.sin(midAngle) * radius;
    }

    outList.push(processed);

    if (node.children && node.children.length > 0) {
      const step = (angleRange.max - angleRange.min) / node.children.length;
      node.children.forEach((child, index) => {
        const min = angleRange.min + index * step;
        const max = min + step;
        processHierarchy(child, depth + 1, { min, max }, processed, outList);
      });
    }

    return outList;
  };

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c0e, 0.0035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 48, 120);
    cameraRef.current = camera;

    // 3. WebGL Renderer (guarded: surface the real error instead of a dead canvas)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logCrash('webgl', `WebGL renderer creation failed: ${message}`, {
        stack: err instanceof Error ? err.stack : undefined,
      });
      setGlError(message);
      return;
    }
    renderer.setSize(width, height);
    // Cap pixel ratio on small screens: full device DPR on a phone GPU is the
    // fastest way to exhaust graphics memory and kill the tab mid-navigation.
    const maxDpr = (mountRef.current?.clientWidth || window.innerWidth) < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Surface GPU context loss (the usual phone-crash signature) as a
    // recoverable message instead of a frozen page.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      const message =
        'The graphics context was lost — usually the phone ran out of GPU memory while navigating. Your data is safe. Reload the 3D view to continue.';
      logCrash('webgl', `webglcontextlost: ${message}`);
      setGlError(message);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 260;
    controls.minDistance = 12;
    controls.maxPolarAngle = Math.PI / 2 + 0.35; // Allow slight under-angle
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.4, 350);
    pointLight.position.set(0, 80, 20);
    scene.add(pointLight);

    const coreLight = new THREE.PointLight(0xc2332b, 2.5, 90);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 6. Atmospheric Particle Starfield
    const particleCount = 850;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 360;
      positions[i + 1] = (Math.random() - 0.5) * 240;
      positions[i + 2] = (Math.random() - 0.5) * 360;

      // Color variation in subtle blue/amber/white
      const tint = Math.random();
      if (tint < 0.3) {
        colors[i] = 0.85; colors[i + 1] = 0.35; colors[i + 2] = 0.25; // Warm rust
      } else if (tint < 0.6) {
        colors[i] = 0.2; colors[i + 1] = 0.65; colors[i + 2] = 0.85; // Cool cyan
      } else {
        colors[i] = 0.7; colors[i + 1] = 0.75; colors[i + 2] = 0.85; // Soft star
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.55
    });
    const starField = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starField);

    // 7. Process data into 3D objects
    const processedNodes = processHierarchy(data);
    nodesArrayRef.current = processedNodes;

    // Clear previous HTML labels
    if (labelsContainerRef.current) {
      labelsContainerRef.current.innerHTML = '';
    }
    labelElementsRef.current = [];

    // Create 3D Meshes & Connecting Lines
    processedNodes.forEach((node) => {
      const size = node.depth === 0 ? 5.8 : node.depth === 1 ? 4.0 : node.depth === 2 ? 2.6 : 1.7;
      const sphereGeo = new THREE.SphereGeometry(size, 32, 32);

      const colorHex = new THREE.Color(node.data.color);
      const material = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.2,
        metalness: 0.45,
        emissive: colorHex,
        emissiveIntensity: node.depth === 0 ? 0.65 : 0.35,
        transparent: true,
        opacity: 0.95
      });

      const mesh = new THREE.Mesh(sphereGeo, material);
      mesh.position.set(node.targetX, node.targetY, node.targetZ);
      mesh.userData = node;

      // Add a wireframe aura/halo
      const haloGeo = new THREE.SphereGeometry(size * 1.38, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        wireframe: true,
        transparent: true,
        opacity: node.depth === 0 ? 0.35 : 0.2
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(haloMesh);

      // Core pulsating ring for root
      if (node.depth === 0) {
        const ringGeo = new THREE.RingGeometry(size * 1.6, size * 1.8, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc2332b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        mesh.add(ringMesh);
      }

      node.mesh = mesh;
      scene.add(mesh);

      // Connecting line to parent
      if (node.parent) {
        const lineMat = new THREE.LineBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.45,
          linewidth: 1.5
        });

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(node.parent.targetX, node.parent.targetY, node.parent.targetZ),
          new THREE.Vector3(node.targetX, node.targetY, node.targetZ)
        ]);

        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
        linesArrayRef.current.push(line);
      }

      // Create HTML label overlay
      if (labelsContainerRef.current) {
        const div = document.createElement('div');
        div.className =
          'absolute pointer-events-auto cursor-pointer transition-all duration-150 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-black/85 border border-white/20 text-stone-200 shadow-xl backdrop-blur-md hover:border-white hover:text-white hover:scale-105 whitespace-nowrap font-mono select-none flex items-center gap-1.5';
        div.style.transform = 'translate(-50%, -120%)';
        div.innerHTML = `<span class="w-2 h-2 rounded-full inline-block" style="background-color: ${node.data.color}"></span>${node.data.title}`;
        div.setAttribute('data-node-id', node.data.id);

        div.addEventListener('click', (e) => {
          e.stopPropagation();
          sound.playNodeSelect(node.depth === 0 ? 380 : node.depth === 1 ? 480 : 580);
          onSelectNode(node.data);
        });

        labelsContainerRef.current.appendChild(div);
        labelElementsRef.current.push({ element: div, node });
      }
    });

    // 8. Raycaster & Mouse handlers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = nodesArrayRef.current.map((n) => n.mesh).filter(Boolean);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hitNode = intersects[0].object.userData as ProcessedNode;
        if (hoveredNodeRef.current !== hitNode) {
          hoveredNodeRef.current = hitNode;
          nodesArrayRef.current.forEach((n) => {
            if (n === hitNode) {
              n.mesh.scale.set(1.22, 1.22, 1.22);
            } else if (n.data.id !== selectedNode?.id) {
              n.mesh.scale.set(1, 1, 1);
            }
          });
        }
      } else {
        document.body.style.cursor = 'default';
        if (hoveredNodeRef.current) {
          if (hoveredNodeRef.current.data.id !== selectedNode?.id) {
            hoveredNodeRef.current.mesh.scale.set(1, 1, 1);
          }
          hoveredNodeRef.current = null;
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      // Ignore if clicking on UI overlay
      if ((e.target as HTMLElement).closest('.glass-panel') || (e.target as HTMLElement).closest('.absolute.top-0')) {
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = nodesArrayRef.current.map((n) => n.mesh).filter(Boolean);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clicked = intersects[0].object.userData as ProcessedNode;
        sound.playNodeSelect(clicked.depth === 0 ? 380 : clicked.depth === 1 ? 480 : 580);
        onSelectNode(clicked.data);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);

    // 9. Resize Listener
    const onWindowResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || window.innerWidth;
      const h = mountRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onWindowResize);

    // 10. Animation Render Loop
    const tempVec = new THREE.Vector3();
    const renderLoop = () => {
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
      controls.update();

      // Subtle slow rotation of root particle cloud & core
      starField.rotation.y += 0.0003;
      if (processedNodes[0] && processedNodes[0].mesh) {
        processedNodes[0].mesh.rotation.y += 0.003;
      }

      // Project 3D nodes to 2D HTML labels
      const widthHalf = (mountRef.current?.clientWidth || window.innerWidth) / 2;
      const heightHalf = (mountRef.current?.clientHeight || window.innerHeight) / 2;

      labelElementsRef.current.forEach(({ element, node }) => {
        if (!showLabels) {
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
          return;
        }

        // Check category visibility
        const isCatMatch =
          selectedCategory === 'all' || node.data.category === selectedCategory || node.depth === 0;

        // Check search query match
        const matchesQuery =
          !searchQuery.trim() ||
          node.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.data.details.toLowerCase().includes(searchQuery.toLowerCase());

        tempVec.set(
          node.targetX,
          node.targetY + (node.depth === 0 ? 7 : node.depth === 1 ? 5 : 3.5),
          node.targetZ
        );
        tempVec.project(camera);

        const isBehindCamera = tempVec.z > 1;
        const camDistance = camera.position.distanceTo(
          new THREE.Vector3(node.targetX, node.targetY, node.targetZ)
        );

        if (isBehindCamera || camDistance > 165 || !isCatMatch || (!matchesQuery && searchQuery.trim() !== '')) {
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
        } else {
          // Fade based on distance
          const opacity = Math.min(1, Math.max(0.15, (165 - camDistance) / 100));
          const x = tempVec.x * widthHalf + widthHalf;
          const y = -(tempVec.y * heightHalf) + heightHalf;
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
          element.style.opacity = `${opacity}`;
          element.style.pointerEvents = 'auto';

          // Highlight if search query matches
          if (searchQuery.trim() && matchesQuery) {
            element.classList.add('border-brand-rust', 'text-amber-300', 'scale-110');
          } else {
            element.classList.remove('border-brand-rust', 'text-amber-300', 'scale-110');
          }
        }
      });

      renderer.render(scene, camera);
    };

    renderLoop();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('click', onClick);
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Release every GPU buffer this scene allocated. Without this, each
      // visit to the 3D view leaks 57 sphere geometries + halos + materials
      // until the tab's GPU context dies — the classic navigate-then-crash.
      nodesArrayRef.current.forEach((n) => {
        if (n.mesh) {
          n.mesh.traverse((child: THREE.Object3D) => {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
            if (Array.isArray(material)) material.forEach((m) => m.dispose());
            else if (material) material.dispose();
          });
          scene.remove(n.mesh);
        }
      });
      linesArrayRef.current.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
        scene.remove(line);
      });
      nodesArrayRef.current = [];
      linesArrayRef.current = [];
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [data, retryToken]);

  // Handle Category Filter & Search Query Opacity Updates
  useEffect(() => {
    if (!nodesArrayRef.current.length) return;

    const query = searchQuery.toLowerCase().trim();

    nodesArrayRef.current.forEach((n) => {
      if (!n.mesh) return;

      const isCatMatch =
        selectedCategory === 'all' || n.data.category === selectedCategory || n.depth === 0;

      const isSearchMatch =
        !query ||
        n.data.title.toLowerCase().includes(query) ||
        n.data.details.toLowerCase().includes(query);

      const isVisible = isCatMatch && isSearchMatch;

      if (isVisible) {
        n.mesh.visible = true;
        (n.mesh.material as THREE.MeshStandardMaterial).opacity = 0.95;
        if (query && isSearchMatch && n.depth > 0) {
          n.mesh.scale.set(1.35, 1.35, 1.35);
          (n.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.85;
        } else if (n.data.id === selectedNode?.id) {
          n.mesh.scale.set(1.4, 1.4, 1.4);
          (n.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
        } else {
          n.mesh.scale.set(1, 1, 1);
          (n.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
            n.depth === 0 ? 0.65 : 0.35;
        }
      } else {
        if (!isCatMatch) {
          n.mesh.visible = false;
        } else {
          // Dim non-matching search results
          n.mesh.visible = true;
          (n.mesh.material as THREE.MeshStandardMaterial).opacity = 0.15;
          (n.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
          n.mesh.scale.set(0.75, 0.75, 0.75);
        }
      }
    });

    linesArrayRef.current.forEach((line) => {
      if (selectedCategory === 'all') {
        line.visible = true;
      } else {
        // Only keep lines where connected nodes are visible
        line.visible = true;
      }
    });
  }, [selectedCategory, searchQuery, selectedNode]);

  // Handle Node Selection Fly-in Animation
  useEffect(() => {
    if (!selectedNode || !cameraRef.current || !controlsRef.current) return;

    const targetNode = nodesArrayRef.current.find((n) => n.data.id === selectedNode.id);
    if (!targetNode) return;

    // Highlight node mesh
    nodesArrayRef.current.forEach((n) => {
      if (n.mesh) {
        if (n.data.id === selectedNode.id) {
          n.mesh.scale.set(1.45, 1.45, 1.45);
          (n.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
        } else {
          n.mesh.scale.set(1, 1, 1);
          (n.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
            n.depth === 0 ? 0.65 : 0.35;
        }
      }
    });

    // Calculate camera target offset so inspector panel on right doesn't cover node
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    // Position camera with nice distance based on depth
    const distanceOffset = targetNode.depth === 0 ? 55 : targetNode.depth === 1 ? 40 : 28;
    const angle = Math.atan2(targetNode.targetZ, targetNode.targetX);

    // Position camera slightly offset to the left of the node, looking in
    const targetCamPos = new THREE.Vector3(
      targetNode.targetX + Math.cos(angle + 0.3) * distanceOffset - 6,
      targetNode.targetY + 12,
      targetNode.targetZ + Math.sin(angle + 0.3) * distanceOffset + 15
    );

    const lookAtPos = new THREE.Vector3(targetNode.targetX, targetNode.targetY, targetNode.targetZ);

    let progress = 0;
    isAnimatingCamRef.current = true;

    const stepCam = () => {
      if (!isAnimatingCamRef.current) return;
      progress += 0.045;
      if (progress <= 1) {
        // Ease out quad
        const ease = 1 - (1 - progress) * (1 - progress);
        camera.position.lerpVectors(startPos, targetCamPos, ease);
        controls.target.lerpVectors(startTarget, lookAtPos, ease);
        requestAnimationFrame(stepCam);
      } else {
        camera.position.copy(targetCamPos);
        controls.target.copy(lookAtPos);
        isAnimatingCamRef.current = false;
      }
    };
    stepCam();
  }, [selectedNode]);

  // Handle Camera Presets (Reset, Root, Top-Down)
  useEffect(() => {
    if (!cameraPresetTrigger || !cameraRef.current || !controlsRef.current) return;

    sound.playCameraSwoosh();
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();

    let targetCamPos = new THREE.Vector3(0, 48, 120);
    let lookAtPos = new THREE.Vector3(0, 0, 0);

    if (cameraPresetTrigger.type === 'root') {
      targetCamPos = new THREE.Vector3(0, 16, 52);
      lookAtPos = new THREE.Vector3(0, 0, 0);
    } else if (cameraPresetTrigger.type === 'top') {
      targetCamPos = new THREE.Vector3(0, 135, 0.1);
      lookAtPos = new THREE.Vector3(0, 0, 0);
    } else if (cameraPresetTrigger.type === 'reset') {
      targetCamPos = new THREE.Vector3(0, 48, 120);
      lookAtPos = new THREE.Vector3(0, 0, 0);
    }

    let progress = 0;
    isAnimatingCamRef.current = true;
    const stepCam = () => {
      if (!isAnimatingCamRef.current) return;
      progress += 0.045;
      if (progress <= 1) {
        const ease = 1 - (1 - progress) * (1 - progress);
        camera.position.lerpVectors(startPos, targetCamPos, ease);
        controls.target.lerpVectors(startTarget, lookAtPos, ease);
        requestAnimationFrame(stepCam);
      } else {
        camera.position.copy(targetCamPos);
        controls.target.copy(lookAtPos);
        isAnimatingCamRef.current = false;
      }
    };
    stepCam();
  }, [cameraPresetTrigger]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        data-testid="three-canvas"
      />
      <div ref={labelsContainerRef} className="absolute inset-0 pointer-events-none z-10" />
      {glError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0C0E]/95 p-6">
          <div className="max-w-md w-full text-center space-y-3 p-5 rounded-2xl border border-red-900/60 bg-stone-950/80">
            <div className="text-red-400 font-mono font-bold uppercase text-sm tracking-wider">
              3D view crashed
            </div>
            <p className="text-[11px] text-stone-400 font-mono break-words leading-relaxed">
              {glError}
            </p>
            <button
              onClick={() => {
                setGlError(null);
                setRetryToken((t) => t + 1);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold transition-colors"
            >
              Reload 3D view
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
