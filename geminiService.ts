
import { GoogleGenAI } from "@google/genai";
import { CalculationInputs, CalculationResults } from "./types";

export const getStrategyAnalysis = async (inputs: CalculationInputs, results: CalculationResults): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const milestoneInfo = results.milestoneTrade 
    ? `The sustainability capital milestone is reached on Trade #${results.milestoneTrade.index} (${results.milestoneTrade.date}).` 
    : "The sustainability capital milestone is not reached within this duration.";

  const prompt = `
    As a professional trading strategist, analyze the following compounding plan:
    
    - Starting Capital: $${inputs.startAmount}
    - Duration: ${inputs.days} days
    - Trades per day: ${inputs.tradesPerDay}
    - Profit target per trade: ${inputs.profitPct}%
    
    Current Goal: Reach the sustainability milestone to begin a 50/50 withdrawal/reinvestment phase.
    ${milestoneInfo}
    
    Projected Final Outcome:
    - Final Balance: $${results.finalBalance.toFixed(2)}
    - Total Growth: ${results.growthPercentage.toFixed(2)}%
    
    Please provide:
    1. A brief feasibility check (probability of hitting that ${inputs.profitPct}% target daily).
    2. Advice on psychological hurdles once the sustainability milestone is reached.
    3. One actionable tip for maintaining consistency after withdrawals begin.
    
    Keep the response concise (max 150 words) and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "The AI analysis is currently unavailable. Please check your network connection.";
  }
};
