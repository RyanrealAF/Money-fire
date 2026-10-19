import React, { useState } from 'react';
import { MindMapNode } from '../types';
import {
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Target,
  ArrowLeft,
  Flame,
  Ambulance,
  Scale,
  Home,
  Megaphone
} from 'lucide-react';
import { sound } from '../utils/audio';

interface DetailPanelProps {
  node: MindMapNode | null;
  onClose: () => void;
  onSelectNode: (node: MindMapNode) => void;
  allNodes: MindMapNode[];
  onFlyToNode: (node: MindMapNode) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  node,
  onClose,
  onSelectNode,
  allNodes,
  onFlyToNode
}) => {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'pillar-1':
        return (
          <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-700/50 text-[10px] font-mono flex items-center gap-1">
            <Flame className="w-3 h-3" /> 1. Fiscal Money Fire
          </span>
        );
      case 'pillar-2':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-700/50 text-[10px] font-mono flex items-center gap-1">
            <Ambulance className="w-3 h-3" /> 2. Civilian Mobile Crisis
          </span>
        );
      case 'pillar-3':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 text-[10px] font-mono flex items-center gap-1">
            <Scale className="w-3 h-3" /> 3. Judicial Diversion
          </span>
        );
      case 'pillar-4':
        return (
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 text-[10px] font-mono flex items-center gap-1">
            <Home className="w-3 h-3" /> 4. 1115 Waivers / PSH
          </span>
        );
      case 'pillar-5':
        return (
          <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-400 border border-purple-700/50 text-[10px] font-mono flex items-center gap-1">
            <Megaphone className="w-3 h-3" /> 5. Action Plan & Off-Ramps
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono border border-stone-700">
            Core Master Framework
          </span>
        );
    }
  };

  const handleCopy = () => {
    const text = `[Policy Blueprint] ${node.title}\n${node.details}\n${
      node.actionRecommendation ? `Action: ${node.actionRecommendation}\n` : ''
    }${node.citations ? `Citations: ${node.citations.join('; ')}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="absolute top-20 right-3 md:right-4 z-20 w-80 sm:w-96 max-h-[calc(100vh-6rem)] glass-panel rounded-2xl shadow-2xl p-4 sm:p-5 overflow-y-auto border border-white/10 transition-all select-none animate-in fade-in slide-in-from-right duration-200"
      data-testid="detail-panel"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          {getCategoryBadge(node.category)}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onFlyToNode(node)}
            title="Focus camera directly on this 3D node"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Target className="w-4 h-4 text-amber-400" />
          </button>
          <button
            onClick={handleCopy}
            title="Copy policy card to clipboard"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close inspector panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3.5 space-y-3.5 font-sans">
        {/* Title */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0 inline-block shadow-sm"
              style={{ backgroundColor: node.color }}
            />
            {node.title}
          </h2>
          {node.subtitle && (
            <p className="text-xs text-stone-400 font-mono mt-0.5">{node.subtitle}</p>
          )}
        </div>

        {/* Core Summary Description */}
        <div className="text-xs text-stone-200 leading-relaxed bg-stone-900/80 p-3 rounded-xl border border-stone-800 shadow-inner">
          {node.details}
        </div>

        {/* Extended Analysis if available */}
        {node.extendedAnalysis && (
          <div className="text-[11px] text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
            <div className="font-mono text-[10px] text-stone-400 uppercase font-semibold mb-1 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-cyan-400" /> Operational Context & Mechanics
            </div>
            {node.extendedAnalysis}
          </div>
        )}

        {/* Metrics Grid */}
        {node.metrics && node.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {node.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-stone-950/90 p-2.5 rounded-lg border border-stone-800 flex flex-col justify-between"
              >
                <div className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">
                  {m.label}
                </div>
                <div
                  className={`text-base font-black font-mono my-0.5 ${
                    m.trend === 'positive'
                      ? 'text-emerald-400'
                      : m.trend === 'negative'
                      ? 'text-red-400'
                      : 'text-amber-300'
                  }`}
                >
                  {m.value}
                </div>
                {m.subtext && <div className="text-[9px] text-stone-500 leading-tight">{m.subtext}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Immediate Action Recommendation */}
        {node.actionRecommendation && (
          <div className="bg-amber-950/30 border border-amber-600/40 p-3 rounded-xl">
            <div className="text-[10px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Immediate Municipal Action Directive
            </div>
            <p className="text-xs text-stone-200 leading-relaxed">
              {node.actionRecommendation}
            </p>
          </div>
        )}

        {/* Citations & Research */}
        {node.citations && node.citations.length > 0 && (
          <div className="pt-2 border-t border-stone-800/80">
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-stone-500" />
              Empirical Evidence & Citations
            </div>
            <ul className="space-y-1 text-[10px] text-stone-400 font-sans">
              {node.citations.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-400">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Connected Sub-Nodes */}
        {node.children && node.children.length > 0 && (
          <div className="pt-3 border-t border-stone-800">
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-2 flex items-center justify-between">
              <span>Connected Sub-Nodes ({node.children.length})</span>
              <span className="text-[9px] text-stone-500 font-sans">Click to inspect</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {node.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    sound.playNodeSelect(520);
                    onSelectNode(child);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-stone-800/80 hover:border-stone-600 transition-all text-xs text-stone-200 flex items-center justify-between group font-sans"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: child.color }}
                    />
                    <span className="truncate">{child.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
