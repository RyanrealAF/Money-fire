import React from 'react';
import { ViewMode } from '../types';
import { Flame, Search, X, Box, FolderTree, Table, Calculator, Volume2, VolumeX, FileText } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenExecutiveBrief: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  soundEnabled,
  onToggleSound,
  onOpenExecutiveBrief
}) => {
  const handleModeSwitch = (mode: ViewMode) => {
    sound.playModeSwitch();
    onViewModeChange(mode);
  };

  return (
    <header className="absolute top-0 left-0 right-0 h-16 z-50 px-3 md:px-5 flex items-center justify-between glass-panel border-b border-white/10 select-none">
      {/* Brand & Title */}
      <div className="flex items-center space-x-2.5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-500 pulse-rust shadow-lg shrink-0">
          <Flame className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-stone-100 uppercase font-mono whitespace-nowrap">
              Stop The Money Fire
            </h1>
            <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 font-mono border border-red-500/40 whitespace-nowrap">
              3D POLICY MAP
            </span>
          </div>
          <p className="text-[10px] text-stone-400 hidden xl:block font-sans whitespace-nowrap">
            Rebuilding Public Safety & Homelessness Infrastructure
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-32 sm:w-48 md:w-64 mx-2">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search nodes, models..."
          className="w-full bg-stone-900/90 border border-stone-700/80 rounded-lg pl-8 pr-7 py-1 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-red-500 transition-colors font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* View Switcher & Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        <div className="bg-stone-950/95 border border-stone-800 p-0.5 sm:p-1 rounded-lg flex space-x-0.5 sm:space-x-1">
          <button
            onClick={() => handleModeSwitch('3d')}
            className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 font-mono ${
              viewMode === '3d'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="3D Neural Mind Map"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D</span>
          </button>

          <button
            onClick={() => handleModeSwitch('tree')}
            className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 font-mono ${
              viewMode === 'tree'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Hierarchical Outline View"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OUTLINE</span>
          </button>

          <button
            onClick={() => handleModeSwitch('matrix')}
            className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 font-mono ${
              viewMode === 'matrix'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Regional Evidence & ROI Matrix"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MATRIX</span>
          </button>

          <button
            onClick={() => handleModeSwitch('simulator')}
            className={`px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 font-mono ${
              viewMode === 'simulator'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Municipal Street Math Simulator"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SIMULATOR</span>
          </button>
        </div>

        {/* Executive Brief Modal Trigger */}
        <button
          onClick={onOpenExecutiveBrief}
          title="Executive Policy Brief"
          className="p-1 sm:px-2 sm:py-1 rounded-lg bg-stone-900 border border-stone-700/80 text-stone-300 hover:text-white hover:border-red-500/60 transition-colors flex items-center gap-1 text-[11px] sm:text-xs font-mono"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline">BRIEF</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
          className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-colors"
          aria-label="Toggle sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-500" />
          )}
        </button>
      </div>
    </header>
  );
};
