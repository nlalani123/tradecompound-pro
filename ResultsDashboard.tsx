
import React from 'react';
import { CalculationResults } from '../types';
import { ArrowUpRight, Target, Wallet, Zap } from 'lucide-react';

interface Props {
  results: CalculationResults;
  startAmount: number;
}

const ResultsDashboard: React.FC<Props> = ({ results, startAmount }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Final Balance */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
            <Wallet className="w-3 h-3" /> Final Balance
          </span>
          <span className="text-2xl font-black text-slate-900 mono">
            {formatCurrency(results.finalBalance)}
          </span>
          <div className="mt-2 flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg w-fit text-[11px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            {results.growthPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Total Profit */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Total Net Profit
          </span>
          <span className="text-2xl font-black text-slate-900 mono">
            {formatCurrency(results.totalProfit)}
          </span>
          <div className="mt-2 text-[11px] font-medium text-slate-500">
            {results.totalTrades} Trades executed
          </div>
        </div>
      </div>

      {/* Target Milestone */}
      <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg border border-indigo-700 transition-all hover:scale-[1.02]">
        <div className="flex flex-col text-white">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" /> Sustainability Target
          </span>
          {results.milestoneTrade ? (
            <>
              <span className="text-2xl font-black mono">
                Trade #{results.milestoneTrade.index}
              </span>
              <div className="mt-2 text-[11px] font-medium text-indigo-200">
                Reached on {results.milestoneTrade.date}
              </div>
            </>
          ) : (
            <>
              <span className="text-2xl font-black mono text-indigo-300">N/A</span>
              <div className="mt-2 text-[11px] font-medium text-indigo-200">
                Goal not met in this duration
              </div>
            </>
          )}
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Final 1% Risk Unit</span>
          <span className="text-2xl font-black text-slate-900 mono">
            {formatCurrency(results.finalBalance * 0.01)}
          </span>
          <div className="mt-2 text-[11px] font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg w-fit">
            Next Position Limit
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
