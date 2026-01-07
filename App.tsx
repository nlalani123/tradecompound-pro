
import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, BarChart3, History } from 'lucide-react';
import { CalculationInputs, CalculationResults, TradeRow, WithdrawalFrequency } from './types';
import InputSection from './components/InputSection';
import ResultsDashboard from './components/ResultsDashboard';
import Visualizer from './components/Visualizer';
import TradeLog from './components/TradeLog';
import SustainabilitySolver from './components/SustainabilitySolver';
import WithdrawalGrowthTable from './components/WithdrawalGrowthTable';
import ProGate from './components/ProGate';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const DEFAULT_INPUTS: CalculationInputs = {
  startAmount: 1000,
  days: 180,
  tradesPerDay: 2,
  profitPct: 0.62,
  startDate: getTodayDate(),
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>(DEFAULT_INPUTS);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(500);
  const [frequency, setFrequency] = useState<WithdrawalFrequency>('weekly');

  const results = useMemo((): CalculationResults => {
    const { startAmount, days, tradesPerDay, profitPct, startDate } = inputs;
    const profitRate = profitPct / 100;
    
    const GROWTH_SURPLUS_FACTOR = 0.5;
    const periodDays = frequency === 'weekly' ? 7 : 30;
    const tradesInPeriod = periodDays * tradesPerDay;
    const growthRatePerPeriod = Math.pow(1 + profitRate, tradesInPeriod) - 1;
    
    const targetBalance = withdrawalAmount > 0 
      ? withdrawalAmount / (growthRatePerPeriod * GROWTH_SURPLUS_FACTOR) 
      : startAmount * 2;
    
    let baseDate: Date;
    try {
      const parts = startDate.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        baseDate = new Date();
      }
    } catch (e) {
      baseDate = new Date();
    }
    
    const rows: TradeRow[] = [];
    let currentBalance = startAmount;
    let milestoneTrade: TradeRow | undefined;

    const totalTrades = Math.max(1, days * tradesPerDay);

    for (let t = 1; t <= totalTrades; t++) {
      const dayOffset = Math.ceil(t / tradesPerDay) - 1;
      const tradeDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + dayOffset);
      
      const dateStr = tradeDay.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });

      const currentDayNum = Math.ceil(t / tradesPerDay);
      const tradeInDay = t % tradesPerDay === 0 ? tradesPerDay : t % tradesPerDay;
      const profit = currentBalance * profitRate;
      currentBalance += profit;
      const onePct = currentBalance * 0.01;

      const isMilestone = !milestoneTrade && currentBalance >= targetBalance;
      
      const row: TradeRow = {
        index: t,
        day: currentDayNum,
        tradeInDay,
        balance: currentBalance,
        onePct,
        profit,
        cumulativeProfit: currentBalance - startAmount,
        date: dateStr,
        isMilestone
      };

      if (isMilestone) {
        milestoneTrade = row;
      }

      rows.push(row);
    }

    const finalBalance = currentBalance;
    const totalProfit = finalBalance - startAmount;
    const growthPercentage = (totalProfit / startAmount) * 100;

    return {
      rows,
      totalTrades,
      finalBalance,
      totalProfit,
      growthPercentage,
      milestoneTrade
    };
  }, [inputs, withdrawalAmount, frequency]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-200">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              TradeCompound Pro
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors">
              <Calculator className="w-4 h-4" /> Calculator
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors">
              <BarChart3 className="w-4 h-4" /> Visualizer
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <InputSection inputs={inputs} setInputs={setInputs} />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <ResultsDashboard results={results} startAmount={inputs.startAmount} />
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  Phase 1: Compounding Foundation
                </h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Visualizing Exponential Returns
                </div>
              </div>
              <div className="p-6 h-[380px]">
                <Visualizer data={results.rows} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-500" />
                  Growth Ledger
                </h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Milestone: Sustainability Goal
                </div>
              </div>
              <TradeLog rows={results.rows} />
            </div>

            {/* Pro Paywall Gate for Withdrawal/Sustainability Section */}
            <ProGate>
              <div className="space-y-8">
                <SustainabilitySolver 
                  mainInputs={inputs}
                  withdrawalAmount={withdrawalAmount}
                  setWithdrawalAmount={setWithdrawalAmount}
                  frequency={frequency}
                  setFrequency={setFrequency}
                />

                <WithdrawalGrowthTable 
                  mainInputs={inputs}
                  withdrawalAmount={withdrawalAmount}
                  frequency={frequency}
                />
              </div>
            </ProGate>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
