import React, { useState } from 'react';
import { MindMapNode } from '../types';
import {
  FolderTree,
  ChevronDown,
  ChevronRight,
  Box,
  Flame,
  Ambulance,
  Scale,
  Home,
  Megaphone,
  Network,
  Maximize2,
  Minimize2,
  ExternalLink
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TreeOutlineViewProps {
  rootNode: MindMapNode;
  onSelectNodeIn3D: (node: MindMapNode) => void;
  searchQuery: string;
}

interface TreeNodeItemProps {
  node: MindMapNode;
  onSelectNodeIn3D: (node: MindMapNode) => void;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  searchQuery: string;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  onSelectNodeIn3D,
  expandedMap,
  onToggleExpand,
  searchQuery
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedMap[node.id] ?? true;

  const matchesSearch =
    !searchQuery.trim() ||
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.details.toLowerCase().includes(searchQuery.toLowerCase());

  const getPillarIcon = (cat: string) => {
    switch (cat) {
      case 'pillar-1':
        return <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'pillar-2':
        return <Ambulance className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'pillar-3':
        return <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'pillar-4':
        return <Home className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'pillar-5':
        return <Megaphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      default:
        return <Network className="w-3.5 h-3.5 text-stone-300 shrink-0" />;
    }
  };

  return (
    <div className="ml-3 sm:ml-5 pl-2 sm:pl-3 border-l border-stone-800/80 my-1 font-sans">
      <div
        className={`group p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
          matchesSearch
            ? 'bg-stone-900/60 hover:bg-stone-900 border-stone-800/80 hover:border-stone-700'
            : 'opacity-40 border-transparent hover:opacity-80'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
            onClick={() => hasChildren && onToggleExpand(node.id)}
          >
            {hasChildren ? (
              <button
                className="p-0.5 text-stone-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(node.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>
            ) : (
              <span className="w-3.5 inline-block text-center text-stone-600 text-xs">•</span>
            )}

            {getPillarIcon(node.category)}

            <span className="font-semibold text-xs sm:text-sm text-stone-100 truncate font-mono">
              {node.title}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => {
                sound.playNodeSelect(520);
                onSelectNodeIn3D(node);
              }}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white text-[10px] font-mono transition-colors flex items-center gap-1 shadow-sm"
              title="Inspect in 3D graph"
            >
              <Box className="w-3 h-3" />
              <span>3D</span>
            </button>
          </div>
        </div>

        {/* Short detail text */}
        <p className="text-[11px] text-stone-400 pl-6 leading-relaxed">
          {node.details}
        </p>

        {/* Key Metrics Chips if present */}
        {node.metrics && node.metrics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-6 pt-1">
            {node.metrics.map((m, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 border border-stone-800 text-stone-300 flex items-center gap-1"
              >
                <strong className={m.trend === 'positive' ? 'text-emerald-400' : 'text-red-400'}>
                  {m.value}
                </strong>
                <span className="text-stone-500">{m.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              onSelectNodeIn3D={onSelectNodeIn3D}
              expandedMap={expandedMap}
              onToggleExpand={onToggleExpand}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeOutlineView: React.FC<TreeOutlineViewProps> = ({
  rootNode,
  onSelectNodeIn3D,
  searchQuery
}) => {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const handleToggleExpand = (id: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const nextMap: Record<string, boolean> = {};
    const traverse = (node: MindMapNode) => {
      nextMap[node.id] = true;
      node.children?.forEach(traverse);
    };
    traverse(rootNode);
    setExpandedMap(nextMap);
  };

  const handleCollapseAll = () => {
    const nextMap: Record<string, boolean> = {};
    const traverse = (node: MindMapNode) => {
      nextMap[node.id] = false;
      node.children?.forEach(traverse);
    };
    traverse(rootNode);
    setExpandedMap(nextMap);
  };

  return (
    <div
      className="absolute inset-0 top-16 z-30 bg-stone-950/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
      data-testid="tree-view-container"
    >
      <div className="max-w-5xl mx-auto pb-16">
        {/* Outline Header Bar */}
        <div className="flex flex-wrap gap-3 justify-between items-center pb-4 border-b border-stone-800 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-100 font-mono flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-red-500" /> Structured Mind Map Hierarchy
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Complete operational taxonomy of fiscal math, crisis dispatch, judicial diversion, 1115 Medicaid waivers, and council action off-ramps.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleExpandAll}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5 text-stone-400" /> Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5 text-stone-400" /> Collapse All
            </button>
          </div>
        </div>

        {/* Tree Root */}
        <div className="space-y-3">
          <TreeNodeItem
            node={rootNode}
            onSelectNodeIn3D={onSelectNodeIn3D}
            expandedMap={expandedMap}
            onToggleExpand={handleToggleExpand}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};
