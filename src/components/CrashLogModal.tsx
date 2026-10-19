import React, { useEffect, useState } from 'react';
import { Bug, X, Copy, Check, Download, Trash2, ChevronDown } from 'lucide-react';
import { getCrashes, clearCrashes, CrashEntry } from '../utils/crashLog';

interface CrashLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KIND_STYLES: Record<string, string> = {
  error: 'bg-red-950/70 text-red-300 border-red-800/50',
  unhandledrejection: 'bg-amber-950/70 text-amber-300 border-amber-800/50',
  react: 'bg-purple-950/70 text-purple-300 border-purple-800/50',
  webgl: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/50',
  info: 'bg-stone-800/70 text-stone-300 border-stone-700/50',
};

export const CrashLogModal: React.FC<CrashLogModalProps> = ({ isOpen, onClose }) => {
  const [crashes, setCrashes] = useState<CrashEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setCrashes(getCrashes());
      setExpanded({});
    }
  }, [isOpen]);

  const handleCopyAll = async () => {
    const text = JSON.stringify(crashes, null, 2);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt('Copy the crash log:', text.slice(0, 4000));
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(crashes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moneyfire-crashlog-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearCrashes();
    setCrashes([]);
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div
      className="fixed inset-0 top-16 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      data-testid="crash-log-modal"
    >
      <div className="glass-panel w-full max-w-3xl max-h-[92vh] rounded-2xl border border-stone-700 flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex flex-wrap gap-3 justify-between items-center bg-stone-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-100 font-mono uppercase">
                Crash Diagnostics
              </h3>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                On-device error log — newest first. Copy or download it and send
                it over after a crash.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              disabled={crashes.length === 0}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
              title="Copy full log as JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={crashes.length === 0}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
              title="Download log as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">JSON</span>
            </button>
            <button
              onClick={handleClear}
              disabled={crashes.length === 0}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-red-950 disabled:opacity-40 text-stone-200 hover:text-red-300 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
              title="Clear the log"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Clear</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close crash diagnostics"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {crashes.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="text-stone-300 font-mono text-sm font-bold">
                No crashes logged
              </div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Good news. If the app ever dies on you, the error lands here
                automatically — open this panel, hit Copy, and send it over.
              </p>
            </div>
          ) : (
            crashes.map((c) => {
              const isOpen = !!expanded[c.id];
              return (
                <div
                  key={c.id}
                  className="bg-stone-900/70 border border-stone-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded((p) => ({ ...p, [c.id]: !p[c.id] }))}
                    className="w-full p-3 flex items-center gap-3 text-left hover:bg-stone-900 transition-colors"
                  >
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase shrink-0 ${
                        KIND_STYLES[c.kind] || KIND_STYLES.info
                      }`}
                    >
                      {c.kind}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs text-stone-200 font-mono truncate">
                        {c.message}
                      </span>
                      <span className="block text-[10px] text-stone-500 font-mono">
                        {formatTime(c.ts)}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 space-y-2">
                      {c.stack && (
                        <pre className="text-[10px] text-stone-400 font-mono bg-black/60 p-2.5 rounded-lg border border-stone-800 overflow-x-auto whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                          {c.stack}
                        </pre>
                      )}
                      {c.componentStack && (
                        <pre className="text-[10px] text-purple-300/80 font-mono bg-black/60 p-2.5 rounded-lg border border-stone-800 overflow-x-auto whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                          {c.componentStack}
                        </pre>
                      )}
                      <pre className="text-[10px] text-stone-500 font-mono bg-black/60 p-2.5 rounded-lg border border-stone-800 overflow-x-auto whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                        {JSON.stringify(c.context, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-500 font-mono px-5">
          Log persists on this device only — nothing is uploaded anywhere.
        </div>
      </div>
    </div>
  );
}
