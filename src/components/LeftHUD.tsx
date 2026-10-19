import React, { useState } from 'react';
import { PillarCategory } from '../types';
import {
  Skull,
  Flame,
  Ambulance,
  Scale,
  Home,
  Megaphone,
  Globe,
  RotateCcw,
  Target,
  Layers,
  Type,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LeftHUDProps {
  selectedCategory: PillarCategory;
  onSelectCategory: (cat: PillarCategory) => void;
  categoryCounts: Record<string, number>;
  onCameraPreset: (type: 'reset' | 'root' | 'top') => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onOpenSimulator: () => void;
}

export const LeftHUD: React.FC<LeftHUDProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  onCameraPreset,
  showLabels,
  onToggleLabels,
  onOpenSimulator
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpandedMath, setIsExpandedMath] = useState(false);

  const pillars = [
    { id: 'all' as PillarCategory, label: 'All Infrastructure Nodes', icon: Globe, color: 'text-stone-300', count: categoryCounts['all'] || 0 },
    { id: 'pillar-1' as PillarCategory, label: '1. The Fiscal Money Fire', icon: Flame, color: 'text-red-400', count: categoryCounts['pillar-1'] || 0 },
    { id: 'pillar-2' as PillarCategory, label: '2. Civilian Mobile Crisis', icon: Ambulance, color: 'text-amber-400', count: categoryCounts['pillar-2'] || 0 },
    { id: 'pillar-3' as PillarCategory, label: '3. Judicial Diversion & CIT', icon: Scale, color: 'text-emerald-400', count: categoryCounts['pillar-3'] || 0 },
    { id: 'pillar-4' as PillarCategory, label: '4. 1115 Waivers & PSH', icon: Home, color: 'text-cyan-400', count: categoryCounts['pillar-4'] || 0 },
    { id: 'pillar-5' as PillarCategory, label: '5. Action Plan & Off-Ramps', icon: Megaphone, color: 'text-purple-400', count: categoryCounts['pillar-5'] || 0 },
  ];

  return (
    <div
      className={`absolute top-20 left-3 md:left-4 z-20 flex flex-col gap-2.5 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'w-10' : 'w-72 sm:w-80'
      }`}
    >
      {/* Collapse Toggle Tab */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="self-end bg-stone-900 border border-stone-800 text-stone-400 hover:text-white p-1 rounded-md text-xs shadow-md transition-colors"
        title={isCollapsed ? 'Expand Dashboard HUD' : 'Collapse Dashboard HUD'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {!isCollapsed && (
        <>
          {/* Status Quo Street Math HUD */}
          <div className="glass-panel-rust p-3.5 rounded-xl text-stone-200 shadow-2xl border border-red-900/50">
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-red-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-red-400" />
                Status Quo Street Math
              </span>
              <button
                onClick={() => setIsExpandedMath(!isExpandedMath)}
                className="text-[10px] text-stone-400 hover:text-red-300 underline font-mono cursor-pointer"
              >
                {isExpandedMath ? 'Hide' : 'Details'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/65 p-2 rounded-lg border border-red-900/50">
                <div className="text-[9px] text-stone-400 font-mono uppercase tracking-tight">Annual Cost / Person</div>
                <div className="text-lg font-black text-red-400 font-mono tracking-tight">$43,000</div>
                <div className="text-[9px] text-stone-500">Sweeps, ER & Jail Intakes</div>
              </div>

              <div className="bg-black/65 p-2 rounded-lg border border-amber-900/50">
                <div className="text-[9px] text-stone-400 font-mono uppercase tracking-tight">Success Rate</div>
                <div className="text-lg font-black text-amber-400 font-mono tracking-tight">0.3%</div>
                <div className="text-[9px] text-stone-500">Two-Block Displacement</div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-stone-300 bg-red-950/50 p-2 rounded border border-red-900/40 leading-snug">
              <strong className="text-red-400 font-mono font-bold">13.9x–40x Overdose Spikes:</strong> Forced displacement severs clinical continuity, resets drug tolerance, and turns standard doses fatal.
            </div>

            {isExpandedMath && (
              <div className="mt-2 pt-2 border-t border-red-900/40 text-[10px] space-y-1.5 text-stone-300">
                <div className="flex justify-between font-mono">
                  <span className="text-stone-400">Police & Hazmat Sweeps:</span>
                  <span className="text-red-300 font-bold">$12,400</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-stone-400">Emergency Dept Churn:</span>
                  <span className="text-red-300 font-bold">$18,200</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-stone-400">County Jail Nights:</span>
                  <span className="text-red-300 font-bold">$12,400</span>
                </div>
                <button
                  onClick={onOpenSimulator}
                  className="w-full mt-2 py-1 bg-red-950/80 hover:bg-red-900/90 text-red-200 border border-red-700/60 rounded text-[10px] font-mono font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  Launch Municipal Cost Calculator
                </button>
              </div>
            )}
          </div>

          {/* Node Category Filters */}
          <div className="glass-panel p-3 rounded-xl shadow-xl flex flex-col gap-1.5 border border-stone-800">
            <span className="text-[10px] font-mono font-bold uppercase text-stone-400 tracking-wider px-1">
              Infrastructure Pillars
            </span>

            <div className="flex flex-col gap-1 text-xs">
              {pillars.map((p) => {
                const Icon = p.icon;
                const isActive = selectedCategory === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playNodeSelect(440);
                      onSelectCategory(p.id);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between border transition-all text-xs font-sans ${
                      isActive
                        ? 'bg-stone-800 border-stone-600 text-stone-100 shadow-sm'
                        : 'border-transparent text-stone-300 hover:bg-stone-900/60'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${p.color}`} />
                      <span className="truncate">{p.label}</span>
                    </span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-stone-700 text-stone-100' : 'bg-stone-900 text-stone-400'
                      }`}
                    >
                      {p.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera Controls HUD */}
          <div className="glass-panel p-2 rounded-xl shadow-xl flex items-center justify-around text-xs border border-stone-800">
            <button
              onClick={() => onCameraPreset('reset')}
              title="Reset 3D Camera Overview"
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => onCameraPreset('root')}
              title="Center on Master Root Node"
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
            >
              <Target className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Center</span>
            </button>

            <button
              onClick={() => onCameraPreset('top')}
              title="Top-Down Overhead Blueprint"
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Top</span>
            </button>

            <button
              onClick={onToggleLabels}
              title={showLabels ? 'Hide 3D Floating Labels' : 'Show 3D Floating Labels'}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-mono ${
                showLabels
                  ? 'bg-stone-800 text-stone-100 hover:bg-stone-700'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Labels</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
