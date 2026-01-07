
import React, { useMemo } from 'react';
import { CalculationInputs } from '../types';
import { DollarSign, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';

interface Props {
  inputs: CalculationInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculationInputs>>;
}

const InputSection: React.FC<Props> = ({ inputs, setInputs }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'startDate' ? value : (parseFloat(value) || 0)
    }));
  };

  const endDateStr = useMemo(() => {
    if (!inputs.startDate || !inputs.days) return '...';
    try {
      const [year, month, day] = inputs.startDate.split('-').map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return '...';
      const d = new Date(year, month - 1, day);
      d.setDate(d.getDate() + inputs.days);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '...';
    }
  }, [inputs.startDate, inputs.days]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-slate-800">Simulation Parameters</h3>
        <p className="text-[10px] text-amber-600 font-medium mt-1 italic flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          <span>This is not a financial Advice, its solely for entertainment purposes only. This calculator is not affiliated with anything.</span>
        </p>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Starting Capital</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <DollarSign className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="number"
              name="startAmount"
              value={inputs.startAmount}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Simulation Duration (Days)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="number"
              name="days"
              value={inputs.days}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-semibold"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Start Date</label>
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="date"
                name="startDate"
                value={inputs.startDate}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-semibold cursor-pointer appearance-none"
              />
            </div>
            
            <div className="flex items-center justify-center py-1">
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Calendar className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="block w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 font-bold">
                {endDateStr}
              </div>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-400 uppercase pointer-events-none">End Date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <p className="text-[11px] text-slate-500 leading-relaxed italic">
          Calculator using optimized target profit with <span className="font-bold text-slate-700">2</span> daily executions.
        </p>
      </div>
    </div>
  );
};

export default InputSection;
