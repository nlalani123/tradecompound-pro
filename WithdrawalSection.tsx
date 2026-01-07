
import React, { useState, useMemo } from 'react';
import { WithdrawalInputs, WithdrawalResults, WithdrawalRow, WithdrawalFrequency } from '../types';
import { Banknote, Repeat, TrendingUp, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const WithdrawalSection: React.FC = () => {
  const [inputs, setInputs] = useState<WithdrawalInputs>({
    startBalance: 10000,
    profitPct: 0.62,
    tradesPerDay: 2,
    frequency: 'weekly',
    amount: 1000,
    periods: 24,
  });

  const results = useMemo((): WithdrawalResults => {
    const { startBalance, profitPct, tradesPerDay, frequency, amount, periods } = inputs;
    const profitRate = profitPct / 100;
    const periodDays = frequency === 'weekly' ? 7 : 30;
    const totalTradesPerPeriod = Math.max(0, Math.floor(periodDays * tradesPerDay));
    
    const rows: WithdrawalRow[] = [];
    let currentBalance = startBalance;
    let lastAfter: number | null = null;
    let consecutiveGrowth = 0;
    let firstGrowPeriod: number | null = null;
    let failPeriod: number | null = null;
    let isSustainable = true;

    // Base date for calculations (defaults to today)
    const baseDate = new Date();

    for (let p = 1; p <= periods; p++) {
      let balanceBefore = currentBalance;
      // Compound for the period
      for (let i = 0; i < totalTradesPerPeriod; i++) {
        balanceBefore *= (1 + profitRate);
      }

      const balanceAfter = balanceBefore - amount;
      let isGrowing = null;

      if (lastAfter !== null) {
        if (balanceAfter > lastAfter) {
          isGrowing = true;
          consecutiveGrowth++;
        } else {
          isGrowing = false;
          consecutiveGrowth = 0;
        }

        if (balanceAfter > 0 && consecutiveGrowth >= 3 && firstGrowPeriod === null) {
          firstGrowPeriod = p - 2;
        }
      }

      // Calculate period date
      const rowDate = new Date(baseDate);
      rowDate.setDate(baseDate.getDate() + (p * periodDays));
      const dateStr = rowDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Fix: Add missing 'date' property required by WithdrawalRow interface
      rows.push({
        period: p,
        before: balanceBefore,
        withdrawal: amount,
        after: balanceAfter,
        isGrowing,
        date: dateStr
      });

      if (balanceAfter <= 0) {
        isSustainable = false;
        failPeriod = p;
        break;
      }

      lastAfter = balanceAfter;
      currentBalance = balanceAfter;
    }

    let statusMessage = "";
    const label = frequency === 'weekly' ? "week" : "month";
    
    if (failPeriod !== null) {
      statusMessage = `Not sustainable: balance depletes in ${label} ${failPeriod}.`;
    } else if (firstGrowPeriod !== null) {
      statusMessage = `Sustainable & growing detected starting around ${label} ${firstGrowPeriod}.`;
    } else {
      statusMessage = `Positive for ${periods} periods, but not consistently growing. Try adjusting parameters.`;
    }

    return { rows, isSustainable, failPeriod, firstGrowPeriod, statusMessage };
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'frequency' ? value : parseFloat(value) || 0
    }));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-12">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <Banknote className="w-5 h-5 text-emerald-600" />
          Sustainable Withdrawal Strategy
        </h3>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Simulation Start ($)</label>
            <input
              type="number"
              name="startBalance"
              value={inputs.startBalance}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Profit %</label>
              <input
                type="number"
                step="0.01"
                name="profitPct"
                value={inputs.profitPct}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Trades/Day</label>
              <input
                type="number"
                name="tradesPerDay"
                value={inputs.tradesPerDay}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Frequency</label>
            <select
              name="frequency"
              value={inputs.frequency}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Withdrawal ($)</label>
            <input
              type="number"
              name="amount"
              value={inputs.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Periods</label>
            <input
              type="number"
              name="periods"
              value={inputs.periods}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Results View */}
        <div className="lg:col-span-3 space-y-6">
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            results.isSustainable && results.firstGrowPeriod 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : !results.isSustainable 
                ? 'bg-rose-50 border-rose-100 text-rose-800'
                : 'bg-amber-50 border-amber-100 text-amber-800'
          }`}>
            {results.isSustainable && results.firstGrowPeriod ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : !results.isSustainable ? (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-sm">Strategic Outcome</p>
              <p className="text-sm opacity-90">{results.statusMessage}</p>
            </div>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden overflow-y-auto max-h-[350px] custom-scrollbar">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 bg-slate-100 z-10">
                <tr>
                  <th className="px-4 py-2 font-bold text-slate-600">Period / Date</th>
                  <th className="px-4 py-2 font-bold text-slate-600 text-right">Pre-WD Balance</th>
                  <th className="px-4 py-2 font-bold text-slate-600 text-right">Withdrawal</th>
                  <th className="px-4 py-2 font-bold text-slate-600 text-right">Post-WD Balance</th>
                  <th className="px-4 py-2 font-bold text-slate-600 text-center">Growth?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.rows.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-slate-500">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">{row.date}</span>
                        <span className="text-slate-700">P{row.period}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-slate-800 mono">{formatCurrency(row.before)}</td>
                    <td className="px-4 py-2 text-right font-medium text-rose-500 mono">-{formatCurrency(row.withdrawal)}</td>
                    <td className={`px-4 py-2 text-right font-bold mono ${row.after < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatCurrency(row.after)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {row.isGrowing === true && <span className="text-emerald-500 font-bold">↑</span>}
                      {row.isGrowing === false && <span className="text-rose-400 font-bold">↓</span>}
                      {row.isGrowing === null && <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSection;
