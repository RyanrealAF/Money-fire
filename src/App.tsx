import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { masterMindMapData } from './data/mindMapData';
import { regionalMatrixData } from './data/matrixData';
import { MindMapNode, PillarCategory, ViewMode } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Header } from './components/Header';
import { LeftHUD } from './components/LeftHUD';
import { DetailPanel } from './components/DetailPanel';
import { TreeOutlineView } from './components/TreeOutlineView';
import { MatrixModal } from './components/MatrixModal';
import { FiscalSimulator } from './components/FiscalSimulator';
import { ExecutiveBriefModal } from './components/ExecutiveBriefModal';
import { CrashLogModal } from './components/CrashLogModal';
import { sound } from './utils/audio';
import { setCrashContext } from './utils/crashLog';

export default function App() {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(masterMindMapData);
  const [selectedCategory, setSelectedCategory] = useState<PillarCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExecutiveBriefOpen, setIsExecutiveBriefOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [cameraPresetTrigger, setCameraPresetTrigger] = useState<{
    type: 'reset' | 'root' | 'top';
    timestamp: number;
  } | null>(null);

  // Flatten all nodes list for lookup and statistics
  const allNodesList = useMemo(() => {
    const list: MindMapNode[] = [];
    const traverse = (node: MindMapNode) => {
      list.push(node);
      node.children?.forEach(traverse);
    };
    traverse(masterMindMapData);
    return list;
  }, []);

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allNodesList.length,
      'pillar-1': 0,
      'pillar-2': 0,
      'pillar-3': 0,
      'pillar-4': 0,
      'pillar-5': 0
    };
    allNodesList.forEach((n) => {
      if (counts[n.category] !== undefined) {
        counts[n.category]++;
      }
    });
    return counts;
  }, [allNodesList]);

  // Handle selecting a node (with 3D camera fly-in)
  const handleSelectNode = useCallback((node: MindMapNode) => {
    setSelectedNode(node);
  }, []);

  // Jump from Tree or Matrix directly to 3D and select node
  const handleJumpTo3DNode = useCallback(
    (node: MindMapNode) => {
      setViewMode('3d');
      setSelectedNode(node);
      // Ensure category matches or reset to 'all'
      if (selectedCategory !== 'all' && node.category !== selectedCategory && node.category !== 'root') {
        setSelectedCategory('all');
      }
    },
    [selectedCategory]
  );

  const handleJumpTo3DNodeById = useCallback(
    (id: string) => {
      const found = allNodesList.find((n) => n.id === id);
      if (found) {
        handleJumpTo3DNode(found);
      }
    },
    [allNodesList, handleJumpTo3DNode]
  );

  // Camera preset handler
  const handleCameraPreset = (type: 'reset' | 'root' | 'top') => {
    setCameraPresetTrigger({ type, timestamp: Date.now() });
    if (type === 'root') {
      setSelectedNode(masterMindMapData);
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Keep the crash log stamped with where the user was when it happened.
  useEffect(() => {
    setCrashContext({ viewMode, selectedNodeId: selectedNode?.id });
  }, [viewMode, selectedNode]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        if (viewMode === 'matrix' || viewMode === 'simulator') {
          setViewMode('3d');
        } else if (isExecutiveBriefOpen) {
          setIsExecutiveBriefOpen(false);
        } else if (isDiagnosticsOpen) {
          setIsDiagnosticsOpen(false);
        } else if (selectedNode && selectedNode.id !== 'root') {
          setSelectedNode(null);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        handleCameraPreset('reset');
      } else if (e.key === '1') {
        setSelectedCategory('pillar-1');
      } else if (e.key === '2') {
        setSelectedCategory('pillar-2');
      } else if (e.key === '3') {
        setSelectedCategory('pillar-3');
      } else if (e.key === '4') {
        setSelectedCategory('pillar-4');
      } else if (e.key === '5') {
        setSelectedCategory('pillar-5');
      } else if (e.key === '0' || e.key === '`') {
        setSelectedCategory('all');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isExecutiveBriefOpen, isDiagnosticsOpen, selectedNode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B0C0E] text-[#E7E0D4] font-sans">
      {/* 1. Header Bar */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenExecutiveBrief={() => setIsExecutiveBriefOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />

      {/* 2. Three.js 3D WebGL Neural Graph */}
      <div className="absolute inset-0 z-0">
        <ThreeCanvas
          data={masterMindMapData}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          showLabels={showLabels}
          cameraPresetTrigger={cameraPresetTrigger}
        />
      </div>

      {/* 3. Left HUD Dashboard (Visible in 3D Mode) */}
      {viewMode === '3d' && (
        <LeftHUD
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          onCameraPreset={handleCameraPreset}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(!showLabels)}
          onOpenSimulator={() => setViewMode('simulator')}
        />
      )}

      {/* 4. Right Inspector Card (Visible in 3D Mode when node is selected) */}
      {viewMode === '3d' && selectedNode && (
        <DetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSelectNode={handleSelectNode}
          allNodes={allNodesList}
          onFlyToNode={(node) => handleJumpTo3DNode(node)}
        />
      )}

      {/* 5. Tree Outline View Overlay */}
      {viewMode === 'tree' && (
        <TreeOutlineView
          rootNode={masterMindMapData}
          onSelectNodeIn3D={handleJumpTo3DNode}
          searchQuery={searchQuery}
        />
      )}

      {/* 6. Comparative Regional Evidence & ROI Matrix Modal */}
      {viewMode === 'matrix' && (
        <MatrixModal
          isOpen={true}
          onClose={() => setViewMode('3d')}
          models={regionalMatrixData}
          onSelectNodeIn3DById={handleJumpTo3DNodeById}
        />
      )}

      {/* 7. Municipal Street Math Simulator Modal */}
      {viewMode === 'simulator' && (
        <FiscalSimulator
          isOpen={true}
          onClose={() => setViewMode('3d')}
          onSwitchTo3D={() => setViewMode('3d')}
        />
      )}

      {/* 8. Executive Policy Brief Modal */}
      {isExecutiveBriefOpen && (
        <ExecutiveBriefModal
          isOpen={true}
          onClose={() => setIsExecutiveBriefOpen(false)}
        />
      )}

      {/* 8b. Crash Diagnostics Modal */}
      {isDiagnosticsOpen && (
        <CrashLogModal
          isOpen={true}
          onClose={() => setIsDiagnosticsOpen(false)}
        />
      )}

      {/* 9. Bottom Tactical Legend HUD (when in 3D view) */}
      {viewMode === '3d' && (
        <div className="hidden sm:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 glass-panel px-4 py-2 rounded-full border border-stone-800 text-[11px] items-center space-x-4 text-stone-400 font-mono shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setSelectedCategory('pillar-1')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${
              selectedCategory === 'pillar-1' ? 'text-red-400 font-bold' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm"></span>
            1. Fiscal Fire
          </button>
          <button
            onClick={() => setSelectedCategory('pillar-2')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${
              selectedCategory === 'pillar-2' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm"></span>
            2. Mobile Crisis
          </button>
          <button
            onClick={() => setSelectedCategory('pillar-3')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${
              selectedCategory === 'pillar-3' ? 'text-emerald-400 font-bold' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
            3. Judicial Diversion
          </button>
          <button
            onClick={() => setSelectedCategory('pillar-4')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${
              selectedCategory === 'pillar-4' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block shadow-sm"></span>
            4. 1115 / PSH
          </button>
          <button
            onClick={() => setSelectedCategory('pillar-5')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${
              selectedCategory === 'pillar-5' ? 'text-purple-400 font-bold' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block shadow-sm"></span>
            5. Off-Ramps
          </button>
        </div>
      )}
    </div>
  );
}
