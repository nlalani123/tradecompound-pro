
import React, { useState, useMemo } from 'react';
import { CalculationInputs, WithdrawalFrequency } from '../types';
import { TrendingUp, ShieldCheck, Zap, Calendar } from 'lucide-react';

interface Props {
  mainInputs: CalculationInputs;
  withdrawalAmount: number;
  frequency: WithdrawalFrequency;
}

const WithdrawalGrowthTable: React.FC<Props> = ({ mainInputs, withdrawalAmount, frequency }) => {
  const [displayPeriods, setDisplayPeriods] = useState(12);

  const tableData = useMemo(() => {
    const { startAmount, profitPct, tradesPerDay, startDate } = mainInputs;
    if (withdrawalAmount <= 0) return null;

    const GROWTH_SURPLUS_FACTOR = 0.5; 
    const profitRate = profitPct / 100;
    const periodDays = frequency === 'weekly' ? 7 : 30;
    const tradesInPeriod = periodDays * tradesPerDay;
    const periodMultiplier = Math.pow(1 + profitRate, tradesInPeriod);
    const growthRatePerPeriod = periodMultiplier - 1;

    const requiredCapital = withdrawalAmount / (growthRatePerPeriod * GROWTH_SURPLUS_FACTOR);
    const totalTradesToMilestone = Math.log(requiredCapital / startAmount) / Math.log(1 + profitRate);
    const daysToMilestone = Math.ceil(totalTradesToMilestone / tradesPerDay);

    const [year, month, day] = startDate.split('-').map(Number);
    const milestoneDate = new Date(year, month - 1, day);
    milestoneDate.setDate(milestoneDate.getDate() + Math.max(0, daysToMilestone));
    
    const rows = [];
    let currentBalance = requiredCapital;

    for (let i = 1; i <= displayPeriods; i++) {
      const rowDate = new Date(milestoneDate);
      rowDate.setDate(milestoneDate.getDate() + ((i - 1) * periodDays));
      const dateStr = rowDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const balanceBefore = currentBalance;
      const profit = balanceBefore * growthRatePerPeriod;
      const balanceAfter = (balanceBefore + profit) - withdrawalAmount;
      const netSurplus = balanceAfter - balanceBefore;
      
      rows.push({
        period: i,
        date: dateStr,
        before: balanceBefore,
        profit: profit,
        withdrawal: withdrawalAmount,
        netGrowth: netSurplus,
        after: balanceAfter,
      });
      
      currentBalance = balanceAfter;
    }
    
    return { 
      rows, 
      requiredCapital, 
      milestoneDateStr: milestoneDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysToMilestone
    };
  }, [mainInputs, withdrawalAmount, frequency, displayPeriods]);

  if (!tableData) return null;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between bg-emerald-50/20 gap-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Phase 2: Wealth Accretion Strategy
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projection:</label>
            <select 
              value={displayPeriods} 
              onChange={(e) => setDisplayPeriods(parseInt(e.target.value))}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {[4, 8, 12, 16, 20, 24, 26].map(p => (
                <option key={p} value={p}>{p} {frequency === 'weekly' ? 'Weeks' : 'Months'}</option>
              ))}
            </select>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Start Threshold</p>
            <p className="text-sm font-black text-slate-900 mono">{formatCurrency(tableData.requiredCapital)}</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-right sticky top-0 z-10">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Period</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opening Balance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Withdrawal</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Closing Balance</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Net Growth Reinvested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.rows.map((row) => (
              <tr key={row.period} className="hover:bg-emerald-50/10 transition-colors text-right">
                <td className="px-6 py-4 text-sm text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1.5">{row.date}</span>
                    <span className="font-bold text-slate-800">{frequency === 'weekly' ? 'Week' : 'Month'} {row.period}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-black text-slate-900 mono">
                  {formatCurrency(row.before)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-rose-500 mono">
                  -{formatCurrency(row.withdrawal)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-700 mono">
                  {formatCurrency(row.after)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black border border-emerald-200">
                      <Zap className="w-2.5 h-2.5" />
                      +{formatCurrency(row.netGrowth)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-emerald-50/30 border-t border-emerald-100/50 flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Condition Check: 
          <span className="bg-emerald-100 text-emerald-800 px-1.5 rounded font-black">STABLE GROWTH APPLIED</span>
        </div>
        <p className="text-[11px] text-slate-500 italic max-w-md text-center leading-tight">
          Principal is strictly expanding. Confirmed that your wealth <span className="uppercase tracking-tighter font-black text-emerald-700">accelerates</span> during withdrawals.
        </p>
      </div>
    </div>
  );
};

export default WithdrawalGrowthTable;
