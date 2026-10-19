import React, { useState } from 'react';
import {
  FileText,
  X,
  Copy,
  Check,
  Printer,
  Flame,
  Ambulance,
  Scale,
  Home,
  Megaphone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyBrief = () => {
    const briefText = `EXECUTIVE POLICY BRIEF: REBUILDING PUBLIC SAFETY INFRASTRUCTURE
Stop The $43,000 Money Fire & Build Clinical Off-Ramps

1. THE FISCAL REALITY (STATUS QUO):
- Annual municipal burn per unsheltered individual: $43,000 (Police overtime, hazmat sweeps, ER churn, jail bookings).
- Long-term treatment retention rate: 0.3% (Pure displacement loop).
- Health risk: 13.9x to 40x fatal overdose spike risk following involuntary sweeps.

2. EVIDENCE-BASED MUNICIPAL PILLARS:
- Pillar 1: Fiscal Fire Audit – Aggregate hidden sweep costs into a single municipal line item.
- Pillar 2: Civilian Mobile Crisis Dispatch – Divert non-violent 911 calls to clinician-paramedic vans (STAR/CAHOOTS) at $500/call (half police cost), 0 arrests across 23,000+ calls.
- Pillar 3: Judicial Diversion & CIT Training – Scale pre- and post-arrest court intercepts; Miami-Dade CMHP closed an entire county jail facility ($12M/yr savings), cutting felony recidivism from 75% to 6%.
- Pillar 4: Medicaid Section 1115 Waivers & PSH – Unlock federal matching funds for pre-release care; Denver PSH RCT proved $8.3M in net avoided public service costs.
- Pillar 5: Four Immediate Council Actions – Establish civilian crisis response, authorize non-congregate tiny homes, scale 40-hr CIT, and realign provider contracts to 90-day retention.

Core Formula: Same-Day Clinical Stabilization + Non-Congregate Housing = Permanent Fiscal Sanity.`;

    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 top-16 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      data-testid="executive-brief-modal"
    >
      <div className="glass-panel w-full max-w-4xl max-h-[92vh] rounded-2xl border border-stone-700 flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-stone-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-mono uppercase">
                Executive Policy Brief & Strategic Dossier
              </h3>
              <p className="text-xs text-stone-400">
                Actionable municipal brief for Mayors, City Managers, City Councils, and Chief Public Defenders.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyBrief}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Copy Brief</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close executive brief modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-200 text-xs sm:text-sm leading-relaxed">
          {/* Executive Overview */}
          <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/40 space-y-2">
            <div className="text-xs uppercase font-mono font-bold tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Executive Problem Statement
            </div>
            <p className="text-stone-300">
              American municipalities currently spend an average of <strong className="text-red-400 font-mono">$43,000 per person annually</strong> executing encampment sweeps, paying police overtime, deploying specialized hazmat compactors, and cycling high-need individuals through county jail bookings and acute emergency room beds.
            </p>
            <p className="text-stone-300">
              Despite this extreme fiscal burn, the status quo produces a catastrophic <strong className="text-amber-400 font-mono">0.3% sustained treatment success rate</strong>, merely displacing people two blocks over while resetting drug tolerance and triggering <strong className="text-red-400 font-mono">13.9x to 40x overdose mortality spikes</strong>.
            </p>
          </div>

          {/* Core Strategic Pillars */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono uppercase font-bold text-stone-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Five Operational Policy Pillars
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                <div className="text-red-400 font-mono font-bold flex items-center gap-1.5 text-xs">
                  <Flame className="w-3.5 h-3.5" /> Pillar 1: Extinguish The Fiscal Fire
                </div>
                <p className="text-[11px] text-stone-400">
                  Audit all city departments to expose hidden sweep costs. Eliminate property destruction and document crushing that resets HUD voucher clocks.
                </p>
              </div>

              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                <div className="text-amber-400 font-mono font-bold flex items-center gap-1.5 text-xs">
                  <Ambulance className="w-3.5 h-3.5" /> Pillar 2: Civilian Mobile Crisis Dispatch
                </div>
                <p className="text-[11px] text-stone-400">
                  Decouple 911 dispatch by deploying unarmed clinician-paramedic vans (STAR/CAHOOTS) to behavioral calls at $500/call (half the cost of armed officers).
                </p>
              </div>

              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                <div className="text-emerald-400 font-mono font-bold flex items-center gap-1.5 text-xs">
                  <Scale className="w-3.5 h-3.5" /> Pillar 3: Judicial Intercepts & CIT
                </div>
                <p className="text-[11px] text-stone-400">
                  Scale court diversion and 40-hr CIT officer training. Follow Miami-Dade's CMHP model which closed an entire county jail facility ($12M/yr savings).
                </p>
              </div>

              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
                <div className="text-cyan-400 font-mono font-bold flex items-center gap-1.5 text-xs">
                  <Home className="w-3.5 h-3.5" /> Pillar 4: Medicaid 1115 Waivers & PSH
                </div>
                <p className="text-[11px] text-stone-400">
                  Solve the "Wrong Pocket Problem" by drawing down 50%–70% federal Medicaid matching funds for pre-release healthcare and permanent supportive housing.
                </p>
              </div>
            </div>
          </div>

          {/* Four Immediate Council Actions */}
          <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="text-xs uppercase font-mono font-bold tracking-wider text-purple-400 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-purple-400" /> Four Immediate City Council Resolutions
            </div>
            <ol className="list-decimal list-inside space-y-2 text-stone-300 text-xs">
              <li>
                <strong className="text-stone-100">Establish Civilian Mobile Response:</strong> Direct 911 dispatchers to route low-risk behavioral health calls to civilian clinician-medic vans.
              </li>
              <li>
                <strong className="text-stone-100">Authorize Non-Congregate Interim Sites:</strong> Reallocate recurring sweep budgets into tiny-home villages and leased motels accepting partners, pets, and possessions.
              </li>
              <li>
                <strong className="text-stone-100">Scale Frontline CIT & SOAR Intercepts:</strong> Train frontline officers in CIT de-escalation and embed SAMHSA SOAR caseworkers directly in courtrooms.
              </li>
              <li>
                <strong className="text-stone-100">Realign Provider Contracts to 90-Day Retention:</strong> Tie municipal homelessness provider funding to 90-day housing stability rather than sweep clearance tallies.
              </li>
            </ol>
          </div>

          {/* Final Formula */}
          <div className="text-center p-3 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs">
            <span className="text-stone-400 uppercase">Core Policy Equation: </span>
            <span className="text-amber-300 font-bold">
              Same-Day Clinical Stabilization + Non-Congregate Housing = Permanent Fiscal Sanity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
