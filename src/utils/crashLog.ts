// Central crash/error log for the Money Fire app.
//
// What it does:
// - Captures window errors, unhandled promise rejections, React render crashes
//   (via CrashBoundary), and explicit reports (e.g. WebGL failures).
// - Stamps every entry with device context: user agent, viewport, pixel ratio,
//   online status, JS heap size, and the GPU renderer string when obtainable.
// - Persists a rolling buffer (last 50 entries) to localStorage so a crash on
//   a phone survives the dead tab and can be exported later from the
//   Diagnostics panel (header bug icon) and sent to the developer.
//
// $0 design: no backend, no third-party service. If remote reporting is ever
// wanted, add a CRASH_REPORT_URL and POST from logCrash().

export type CrashKind = 'error' | 'unhandledrejection' | 'react' | 'webgl' | 'info';

export interface CrashContext {
  viewMode?: string;
  selectedNodeId?: string;
  [key: string]: unknown;
}

export interface CrashEntry {
  id: string;
  ts: string;
  kind: CrashKind;
  message: string;
  stack?: string;
  componentStack?: string;
  context: Record<string, unknown>;
}

const STORAGE_KEY = 'moneyfire.crashlog.v1';
const MAX_ENTRIES = 50;

// App-level context (current view, selected node, ...) — set by App via setCrashContext().
let appContext: CrashContext = {};

export function setCrashContext(ctx: CrashContext): void {
  appContext = { ...appContext, ...ctx };
}

function safeWebglRenderer(): string | undefined {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'webgl-unavailable';
    const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      return (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
    }
    return 'webgl-no-debug-info';
  } catch {
    return 'webgl-probe-failed';
  }
}

function deviceContext(): Record<string, unknown> {
  const ctx: Record<string, unknown> = {
    url: typeof location !== 'undefined' ? location.href : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    viewport:
      typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
  try {
    const mem = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory;
    if (mem && typeof mem.usedJSHeapSize === 'number') {
      ctx.jsHeapMB = Math.round(mem.usedJSHeapSize / 1048576);
    }
  } catch {
    // performance.memory is Chrome-only; absence is fine.
  }
  const gpu = safeWebglRenderer();
  if (gpu) ctx.webglRenderer = gpu;
  return ctx;
}

function readLog(): CrashEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as CrashEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLog(entries: CrashEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
  } catch {
    // Storage full/blocked — never crash the crash logger.
  }
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Record a crash entry. Safe to call from anywhere, including error handlers. */
export function logCrash(
  kind: CrashKind,
  message: string,
  extra?: { stack?: string; componentStack?: string; context?: CrashContext }
): CrashEntry {
  const entry: CrashEntry = {
    id: makeId(),
    ts: new Date().toISOString(),
    kind,
    message: message || '(no message)',
    ...(extra?.stack ? { stack: extra.stack } : {}),
    ...(extra?.componentStack ? { componentStack: extra.componentStack } : {}),
    context: { ...deviceContext(), ...appContext, ...(extra?.context || {}) },
  };
  try {
    const log = readLog();
    log.push(entry);
    writeLog(log);
  } catch {
    // Last-resort: never throw out of the logger.
  }
  return entry;
}

/** Newest-first list of logged crashes. */
export function getCrashes(): CrashEntry[] {
  return readLog().reverse();
}

export function clearCrashes(): void {
  writeLog([]);
}

/** Install global handlers. Call once at app startup. */
export function initCrashReporting(): void {
  if (typeof window === 'undefined') return;

  logCrash('info', 'session start');

  window.addEventListener('error', (e: ErrorEvent) => {
    // Skip resource-load errors (no message, no Error object) — noise.
    if (!e.message && !e.error) return;
    const err = e.error as Error | undefined;
    logCrash('error', e.message || 'Unknown window error', {
      stack: err?.stack,
      context: {
        filename: (e as ErrorEvent).filename,
        lineno: (e as ErrorEvent).lineno,
        colno: (e as ErrorEvent).colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    const reason = e.reason as unknown;
    const asErr = reason as Error | null;
    logCrash(
      'unhandledrejection',
      (asErr && (asErr.message || asErr.stack?.split('\n')[0])) || String(reason),
      { stack: asErr?.stack }
    );
  });
}
