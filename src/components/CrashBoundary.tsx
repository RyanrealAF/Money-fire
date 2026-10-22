import React from 'react';
import { AlertTriangle, Copy, Check, RotateCcw } from 'lucide-react';
import { logCrash, CrashEntry } from '../utils/crashLog';

interface CrashBoundaryProps {
  children: React.ReactNode;
}

interface CrashBoundaryState {
  error: Error | null;
  entry: CrashEntry | null;
  copied: boolean;
}

/**
 * React error boundary: catches render crashes anywhere in the tree, logs
 * them with the component stack to the crash log, and shows a recoverable
 * fallback with a one-tap "copy crash report" button.
 */
export class CrashBoundary extends React.Component<CrashBoundaryProps, CrashBoundaryState> {
  state: CrashBoundaryState = { error: null, entry: null, copied: false };

  static getDerivedStateFromError(error: Error): Partial<CrashBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const entry = logCrash('react', error.message || 'React render crash', {
      stack: error.stack,
      componentStack: errorInfo.componentStack || undefined,
    });
    // Keep the just-logged entry in memory: logCrash returns it, and
    // localStorage persistence can silently fail (blocked/full), in which
    // case getCrashes()[0] would hand back a stale report for an older crash.
    this.setState({ entry });
  }

  private handleCopy = async () => {
    const entry = this.state.entry;
    const text = entry
      ? JSON.stringify(entry, null, 2)
      : `Crash: ${this.state.error?.message}\n${this.state.error?.stack || ''}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable — fall back to a prompt the user can copy from.
      window.prompt('Copy the crash report:', text.slice(0, 4000));
      return;
    }
    this.setState({ copied: true });
    window.setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div className="w-screen h-screen bg-[#0B0C0E] text-[#E7E0D4] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full text-center space-y-4 p-6 rounded-2xl border border-red-900/60 bg-stone-950/80">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="font-mono font-bold uppercase tracking-wider text-red-400 text-sm">
              Something crashed
            </div>
            <p className="text-xs text-stone-400 font-mono break-words">
              {this.state.error.message}
            </p>
            <p className="text-[11px] text-stone-500">
              The crash was saved to the on-device log. Copy the report and send
              it over — that's what fixes it.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleCopy}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
              >
                {this.state.copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {this.state.copied ? 'Copied' : 'Copy crash report'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload app
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
