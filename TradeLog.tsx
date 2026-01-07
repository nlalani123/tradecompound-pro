
import React from 'react';
import { TradeRow } from '../types';
import { Target, Zap } from 'lucide-react';

interface Props {
  rows: TradeRow[];
}

const TradeLog: React.FC<Props> = ({ rows }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
          <tr className="border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date / Reference</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Balance</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Profit</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Risk (1%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr 
              key={row.index} 
              className={`transition-colors group ${
                row.isMilestone 
                  ? 'bg-indigo-50 hover:bg-indigo-100' 
                  : 'hover:bg-slate-50'
              }`}
            >
              <td className="px-6 py-4 text-sm relative">
                {row.isMilestone && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                )}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                    {row.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Day {row.day}</span>
                    <span className="text-slate-400 text-xs font-medium">T{row.tradeInDay}</span>
                    {row.isMilestone && (
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1 tracking-widest shadow-sm animate-pulse">
                        <Target className="w-2.5 h-2.5" /> Sustainability Hit
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right mono">
                {formatCurrency(row.balance)}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-right mono">
                <div className="flex items-center justify-end gap-1">
                  <Zap className="w-3 h-3 opacity-50" />
                  +{formatCurrency(row.profit)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-right font-medium">
                <div className="flex flex-col items-end">
                  <span className="text-rose-500 mono">{formatCurrency(row.onePct)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeLog;
