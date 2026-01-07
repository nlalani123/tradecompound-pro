
import React, { useState, useEffect } from 'react';
import { MessageSquareText, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { CalculationInputs, CalculationResults } from '../types';
import { getStrategyAnalysis } from '../geminiService';

interface Props {
  inputs: CalculationInputs;
  results: CalculationResults;
}

const StrategyAnalysis: React.FC<Props> = ({ inputs, results }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    const result = await getStrategyAnalysis(inputs, results);
    setAnalysis(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, [inputs]); // Only re-fetch when inputs change significantly or user clicks refresh

  return (
    <div className="bg-indigo-900 rounded-2xl shadow-lg border border-indigo-800 p-6 text-white relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-300" />
          AI Strategy Insights
        </h3>
        <button 
          onClick={fetchAnalysis}
          disabled={isLoading}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh Analysis"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative z-10">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-indigo-300 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-medium uppercase tracking-widest">Analyzing Market Logic...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-950/50 rounded-xl p-4 border border-indigo-700/50 prose prose-invert prose-sm">
              <p className="text-indigo-100 leading-relaxed text-sm">
                {analysis || "Adjust your inputs to generate a new AI strategy analysis."}
              </p>
            </div>
            
            <div className="flex items-start gap-2 text-xs text-indigo-300/80">
              <MessageSquareText className="w-4 h-4 shrink-0 mt-0.5" />
              {/* Use className instead of invalid italic prop */}
              <p className="italic">Insights powered by Gemini AI based on your compounding parameters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyAnalysis;
