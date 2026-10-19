import React, { useState, useMemo } from 'react';
import {
  Calculator,
  X,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Heart,
  Shield,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Users
} from 'lucide-react';
import { sound } from '../utils/audio';

interface FiscalSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTo3D: () => void;
}

export const FiscalSimulator: React.FC<FiscalSimulatorProps> = ({
  isOpen,
  onClose,
  onSwitchTo3D
}) => {
  // Simulator inputs
  const [population, setPopulation] = useState<number>(650); // unsheltered individuals
  const [sweepsPerMonth, setSweepsPerMonth] = useState<number>(8); // sweeps/month
  const [transitionPercent, setTransitionPercent] = useState<number>(75); // % shifted to diversion
  const [cityPreset, setCityPreset] = useState<string>('mid');

  // Presets
  const applyPreset = (name: string, pop: number, sweeps: number) => {
    setCityPreset(name);
    setPopulation(pop);
    setSweepsPerMonth(sweeps);
    sound.playModeSwitch();
  };

  // Calculations
  const stats = useMemo(() => {
    // Current Status Quo Costs
    const costPerPerson = 43000;
    const totalStatusQuoAnnual = population * costPerPerson;

    // Breakdown of Status Quo:
    // $12,400 sweeps & police overtime + $18,200 emergency department visits + $12,400 jail nights
    const sweepCostsAnnual = sweepsPerMonth * 12 * 4800 + population * 3200;
    const erCostsAnnual = population * 18200;
    const jailCostsAnnual = population * 12400;

    // Status Quo Outcomes
    const statusQuoRetained = Math.round(population * 0.003); // 0.3% retention
    const estimatedOverdoseRisks = Math.round(population * 0.28); // individuals cycling in high fatal risk

    // Proposed Infrastructure Costs (Civilian Crisis + 1115 Medicaid Waiver PSH)
    // Average PSH cost per person: $22,000/yr.
    // Federal Medicaid 1115 Match: covers 55% of clinical case management & health services (~$9,500 offset).
    // Net municipal cost per person housed: ~$14,500.
    // Mobile crisis team allocation per person: ~$1,200.
    // Total proposed cost per person: ~$16,200.
    const divertedCount = Math.round(population * (transitionPercent / 100));
    const remainingStatusQuo = population - divertedCount;

    const proposedDivertedCost = divertedCount * 16200;
    const remainingCost = remainingStatusQuo * costPerPerson;
    const totalProposedAnnual = proposedDivertedCost + remainingCost;

    // Net Savings & Outcomes
    const netSavings = totalStatusQuoAnnual - totalProposedAnnual;
    const stabilizedInHousing = Math.round(divertedCount * 0.86); // 86% 1-year retention in PSH (Urban Institute Denver RCT)
    const fatalOverdosesPrevented = Math.round(divertedCount * 0.065); // ~6.5% overdose death reduction
    const policeHoursFreed = divertedCount * 32; // ~32 patrol hours per person diverted from sweep/arrest churn

    return {
      totalStatusQuoAnnual,
      sweepCostsAnnual,
      erCostsAnnual,
      jailCostsAnnual,
      statusQuoRetained,
      estimatedOverdoseRisks,
      divertedCount,
      totalProposedAnnual,
      netSavings,
      stabilizedInHousing,
      fatalOverdosesPrevented,
      policeHoursFreed
    };
  }, [population, sweepsPerMonth, transitionPercent]);

  const formatMoney = (val: number) => {
    return '$' + Math.round(val).toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 top-16 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      data-testid="fiscal-simulator"
    >
      <div className="glass-panel w-full max-w-5xl max-h-[92vh] rounded-2xl border border-stone-700 flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-stone-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-mono uppercase flex items-center gap-2">
                Municipal Street Math Simulator
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/40 font-mono">
                  FISCAL PROJECTION ENGINE
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Model the transition from $43,000/person sweep cycles to civilian crisis dispatch and 1115 Medicaid PSH.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close fiscal simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulator Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-950/80 p-3 rounded-xl border border-stone-800">
            <span className="text-xs text-stone-400 font-mono uppercase font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" /> City Size Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset('small', 250, 4)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  cityPreset === 'small'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                Small City (250 pop)
              </button>
              <button
                onClick={() => applyPreset('mid', 650, 8)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  cityPreset === 'mid'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                Mid-Size City (650 pop)
              </button>
              <button
                onClick={() => applyPreset('large', 1500, 16)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  cityPreset === 'large'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                }`}
              >
                Metro / Large City (1,500 pop)
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Unsheltered Population */}
            <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-stone-300 uppercase">
                  Unsheltered Population
                </label>
                <span className="font-mono text-sm font-black text-red-400">
                  {population.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={3000}
                step={25}
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>50</span>
                <span>1,500</span>
                <span>3,000</span>
              </div>
            </div>

            {/* Sweep Frequency */}
            <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-stone-300 uppercase">
                  Sweeps Conducted / Month
                </label>
                <span className="font-mono text-sm font-black text-amber-400">
                  {sweepsPerMonth} ops
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={sweepsPerMonth}
                onChange={(e) => setSweepsPerMonth(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>1 / mo</span>
                <span>15 / mo</span>
                <span>30 / mo</span>
              </div>
            </div>

            {/* Diversion Transition % */}
            <div className="bg-stone-900/70 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-stone-300 uppercase">
                  Pillar Transition Rate
                </label>
                <span className="font-mono text-sm font-black text-emerald-400">
                  {transitionPercent}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={transitionPercent}
                onChange={(e) => setTransitionPercent(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>10% (Pilot)</span>
                <span>50%</span>
                <span>100% (Full Realignment)</span>
              </div>
            </div>
          </div>

          {/* Comparison Cards: Status Quo vs Proposed Infrastructure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Quo Card */}
            <div className="glass-panel-rust p-4 rounded-2xl border border-red-900/70 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-red-900/50">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span className="font-mono text-xs uppercase font-bold text-red-400">
                    Status Quo Fiscal Money Fire
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-800">
                  $43k / Person Burn
                </span>
              </div>

              <div>
                <div className="text-[11px] text-stone-400 font-mono uppercase">Total Annual Public Expenditure</div>
                <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">
                  {formatMoney(stats.totalStatusQuoAnnual)}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-300 pt-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-stone-400">Sweeps & Police Overtime:</span>
                  <span className="text-red-300">{formatMoney(stats.sweepCostsAnnual)}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-stone-400">Emergency Dept Churn:</span>
                  <span className="text-red-300">{formatMoney(stats.erCostsAnnual)}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-stone-400">County Jail Intakes:</span>
                  <span className="text-red-300">{formatMoney(stats.jailCostsAnnual)}</span>
                </div>
              </div>

              <div className="bg-black/60 p-2.5 rounded-xl border border-red-900/40 space-y-1 text-xs">
                <div className="text-red-300 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> 0.3% Treatment Retention
                </div>
                <div className="text-[11px] text-stone-400">
                  Only <strong>{stats.statusQuoRetained}</strong> of {population} people achieve recovery. Displacements spike overdose mortality by 13.9x–40x.
                </div>
              </div>
            </div>

            {/* Proposed Infrastructure Card */}
            <div className="glass-panel p-4 rounded-2xl border border-emerald-900/60 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-900/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs uppercase font-bold text-emerald-400">
                    Realigned Safety Infrastructure
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">
                  Mobile Crisis + 1115 PSH
                </span>
              </div>

              <div>
                <div className="text-[11px] text-stone-400 font-mono uppercase">Realigned Public Budget</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {formatMoney(stats.totalProposedAnnual)}
                </div>
              </div>

              <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 flex justify-between items-center">
                <span className="text-xs font-mono text-stone-300 uppercase">Annual Net Taxpayer Savings:</span>
                <span className="text-xl font-black font-mono text-emerald-300">
                  {formatMoney(stats.netSavings)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-black/50 p-2 rounded-lg border border-stone-800">
                  <div className="text-base font-black text-emerald-400 font-mono">
                    {stats.stabilizedInHousing}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase font-mono">Housed (86%)</div>
                </div>

                <div className="bg-black/50 p-2 rounded-lg border border-stone-800">
                  <div className="text-base font-black text-amber-300 font-mono">
                    {stats.fatalOverdosesPrevented}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase font-mono">Lives Saved</div>
                </div>

                <div className="bg-black/50 p-2 rounded-lg border border-stone-800">
                  <div className="text-base font-black text-cyan-400 font-mono">
                    {stats.policeHoursFreed.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase font-mono">Police Hrs Freed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Takeaway Banner */}
          <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 flex flex-wrap gap-3 items-center justify-between">
            <div className="space-y-0.5 max-w-2xl">
              <div className="text-xs font-bold text-stone-200 font-mono uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                The Structural Conclusion for City Councils
              </div>
              <p className="text-xs text-stone-400">
                Cities don't need new tax revenue to solve public homelessness. Reallocating the existing $43,000/person sweep burn into civilian mobile teams and 1115 Medicaid matching funds generates <strong className="text-emerald-400">{formatMoney(stats.netSavings)}</strong> in annual local fiscal relief while keeping officers focused on violent crime.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onSwitchTo3D();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-lg"
            >
              Explore 3D Strategy Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
