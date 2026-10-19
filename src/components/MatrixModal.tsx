import React, { useState } from 'react';
import { RegionalModel } from '../types';
import {
  Table,
  X,
  Search,
  Box,
  Copy,
  Check,
  Download,
  ExternalLink,
  DollarSign,
  HeartPulse,
  ShieldCheck,
  Building,
  TrendingUp,
  Award
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: RegionalModel[];
  onSelectNodeIn3DById: (id: string) => void;
}

export const MatrixModal: React.FC<MatrixModalProps> = ({
  isOpen,
  onClose,
  models,
  onSelectNodeIn3DById
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<RegionalModel | null>(null);

  const filtered = models.filter(
    (m) =>
      m.program.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.mechanism.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.roi.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCopyTable = () => {
    const header = 'Program\tCity\tMechanism\tClinical Impact\tSafety Impact\tOperating Cost\tNet ROI\n';
    const rows = filtered
      .map(
        (m) =>
          `${m.program}\t${m.city}, ${m.state}\t${m.mechanism}\t${m.healthImpact}\t${m.judicialImpact}\t${m.operatingCost}\t${m.roi}`
      )
      .join('\n');
    navigator.clipboard.writeText(header + rows);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['Program', 'City', 'Years Active', 'Mechanism', 'Clinical Impact', 'Safety Impact', 'Operating Cost', 'Net ROI', 'Source Doc'],
        ...filtered.map((m) => [
          `"${m.program}"`,
          `"${m.city}, ${m.state}"`,
          `"${m.yearsActive}"`,
          `"${m.mechanism.replace(/"/g, '""')}"`,
          `"${m.healthImpact.replace(/"/g, '""')}"`,
          `"${m.judicialImpact.replace(/"/g, '""')}"`,
          `"${m.operatingCost.replace(/"/g, '""')}"`,
          `"${m.roi.replace(/"/g, '""')}"`,
          `"${m.sourceDoc.replace(/"/g, '""')}"`
        ])
      ]
        .map((e) => e.join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'public_safety_roi_matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 top-16 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      data-testid="matrix-modal"
    >
      <div className="glass-panel w-full max-w-6xl max-h-[92vh] rounded-2xl border border-stone-700 flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-stone-800 flex flex-wrap gap-3 justify-between items-center bg-stone-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-100 font-mono uppercase">
                Comparative Regional Evidence & ROI Matrix
              </h3>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Empirical municipal case studies: costs, clinical outcomes, jail offsets, and verified public savings.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Filter */}
            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter models..."
                className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-8 pr-3 py-1 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-red-500 font-sans"
              />
            </div>

            {/* Export buttons */}
            <button
              onClick={handleCopyTable}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
              title="Copy table to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">Copy</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="p-1.5 sm:px-2.5 sm:py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close matrix modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-x-auto overflow-y-auto flex-1 font-sans">
          <table className="w-full text-left text-xs text-stone-300 border-collapse min-w-[850px]">
            <thead className="bg-stone-900 text-stone-100 sticky top-0 uppercase font-mono text-[11px] border-b border-stone-700 tracking-wider">
              <tr>
                <th className="p-3 w-44">Model / City</th>
                <th className="p-3 w-56">Primary Mechanism</th>
                <th className="p-3">Health & Clinical Impact</th>
                <th className="p-3">Judicial & Safety Impact</th>
                <th className="p-3 w-36">Operating Cost</th>
                <th className="p-3 w-48 text-amber-300">Net ROI & Savings</th>
                <th className="p-3 w-20 text-center">3D Map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 font-sans">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-stone-900/70 transition-colors group"
                >
                  {/* Program / City */}
                  <td className="p-3 align-top font-mono">
                    <div className="font-bold text-stone-100 text-sm flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {row.program}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {row.city}, {row.state}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {row.yearsActive}
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] bg-red-950/70 text-red-300 border border-red-800/40 font-mono">
                        {row.keyMetric}
                      </span>
                    </div>
                  </td>

                  {/* Mechanism */}
                  <td className="p-3 align-top text-stone-300 leading-snug">
                    <div className="font-semibold text-stone-200 mb-1">{row.mechanism}</div>
                    <div className="text-[10px] text-stone-500">Agency: {row.leadAgency}</div>
                  </td>

                  {/* Health Impact */}
                  <td className="p-3 align-top text-emerald-300 leading-snug">
                    <div className="flex items-start gap-1">
                      <HeartPulse className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{row.healthImpact}</span>
                    </div>
                  </td>

                  {/* Judicial Impact */}
                  <td className="p-3 align-top text-cyan-300 leading-snug">
                    <div className="flex items-start gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{row.judicialImpact}</span>
                    </div>
                  </td>

                  {/* Operating Cost */}
                  <td className="p-3 align-top text-stone-200 font-mono text-[11px]">
                    <div className="bg-stone-950/60 p-1.5 rounded border border-stone-800">
                      {row.operatingCost}
                    </div>
                  </td>

                  {/* Net ROI */}
                  <td className="p-3 align-top font-mono text-[11px]">
                    <div className="bg-amber-950/40 p-1.5 rounded border border-amber-800/40 text-amber-200 font-semibold">
                      {row.roi}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">
                      {row.annualNetSavings}
                    </div>
                  </td>

                  {/* 3D Jump Button */}
                  <td className="p-3 align-top text-center">
                    {row.relatedNodeId && (
                      <button
                        onClick={() => {
                          sound.playNodeSelect(520);
                          onClose();
                          onSelectNodeIn3DById(row.relatedNodeId!);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-red-600 text-stone-200 hover:text-white transition-all text-xs font-mono shadow flex items-center gap-1 mx-auto"
                        title="Locate in 3D Mind Map"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer with Citation note */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex flex-wrap justify-between items-center text-[11px] text-stone-400 font-mono px-5">
          <span>Sources: Stanford University, Urban Institute RCT, RAND Corporation, Florida Supreme Court</span>
          <span className="text-amber-400 font-bold">Documented Net Taxpayer Offsets Exceed Operating Costs</span>
        </div>
      </div>
    </div>
  );
};
