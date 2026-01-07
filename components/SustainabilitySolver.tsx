
import React, { useMemo } from 'react';
import { Target, Clock, Info, ShieldCheck, TrendingUp, CalendarDays, Zap } from 'lucide-react';
import { CalculationInputs, WithdrawalFrequency } from '../types';

interface Props {
  mainInputs: CalculationInputs;
  withdrawalAmount: number;
  setWithdrawalAmount: (val: number) => void;
  frequency: WithdrawalFrequency;
  setFrequency: (val: WithdrawalFrequency) => void;
}

const SustainabilitySolver: React.FC<Props> = ({ 
  mainInputs, 
  withdrawalAmount, 
  setWithdrawalAmount, 
  frequency, 
  setFrequency 
}) => {
  const GROWTH_SURPLUS_FACTOR = 0.5;

  const solverResult = useMemo(() => {
    const { startAmount, profitPct, tradesPerDay, startDate } = mainInputs;
    if (!startAmount || !profitPct || !tradesPerDay || withdrawalAmount <= 0) return null;

    const profitRate = profitPct / 100;
    const periodDays = frequency === 'weekly' ? 7 : 30;
    const tradesInPeriod = periodDays * tradesPerDay;
    
    const periodMultiplier = Math.pow(1 + profitRate, tradesInPeriod);
    const growthRatePerPeriod = periodMultiplier - 1;

    const requiredCapital = withdrawalAmount / (growthRatePerPeriod * GROWTH_SURPLUS_FACTOR);
    
    const totalTradesNeeded = Math.log(requiredCapital / startAmount) / Math.log(1 + profitRate);
    const daysNeeded = Math.ceil(totalTradesNeeded / tradesPerDay);

    let milestoneDateObj: Date;
    try {
      const parts = startDate.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        milestoneDateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        milestoneDateObj = new Date();
      }
    } catch(e) {
      milestoneDateObj = new Date();
    }
    
    milestoneDateObj.setDate(milestoneDateObj.getDate() + Math.max(0, daysNeeded));
    
    const milestoneDateStr = milestoneDateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const totalPeriodicProfit = requiredCapital * growthRatePerPeriod;

    return {
      days: Math.max(0, daysNeeded),
      date: milestoneDateStr,
      requiredBalance: requiredCapital,
      totalProfit: totalPeriodicProfit,
      reinvestment: totalPeriodicProfit - withdrawalAmount,
      growthRate: growthRatePerPeriod * 100
    };
  }, [mainInputs, withdrawalAmount, frequency]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Sustainability Target
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Desired {frequency === 'weekly' ? 'Weekly' : 'Monthly'} Income</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-semibold text-slate-700"
              />
            </div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as WithdrawalFrequency)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-slate-600 cursor-pointer"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-4">
          {solverResult ? (
            <>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-600 p-2.5 rounded-xl shrink-0 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Target Balance for Expansion</p>
                  <p className="text-2xl font-black text-slate-900 mono">
                    {formatCurrency(solverResult.requiredBalance)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time to Goal</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    {solverResult.days} Days
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Date</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
                    {solverResult.date}
                  </p>
                </div>
              </div>

              <div className="bg-white/60 rounded-lg p-3 text-[11px] font-medium text-slate-600 border border-emerald-100/50 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span>Gross Periodic Profit:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(solverResult.totalProfit)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Net Growth Reinvestment:</span>
                  <span className="font-black text-emerald-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    +{formatCurrency(solverResult.reinvestment)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-slate-400 font-medium italic">Enter an income amount to calculate your true freedom milestone.</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-start mt-4 p-3 bg-slate-50 rounded-lg text-[11px] text-slate-500 leading-relaxed border border-slate-100">
          <Info className="w-4 h-4 shrink-0 text-slate-400" />
          <p>
            This strategy allows for consistent income while simultaneously compounding your capital base further.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilitySolver;
