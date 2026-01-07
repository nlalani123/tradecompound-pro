
export interface TradeRow {
  index: number;
  day: number;
  tradeInDay: number;
  balance: number;
  onePct: number;
  profit: number;
  cumulativeProfit: number;
  date: string;
  isMilestone?: boolean;
}

export interface CalculationInputs {
  startAmount: number;
  days: number;
  tradesPerDay: number;
  profitPct: number;
  startDate: string;
}

export interface CalculationResults {
  rows: TradeRow[];
  totalTrades: number;
  finalBalance: number;
  totalProfit: number;
  growthPercentage: number;
  milestoneTrade?: TradeRow;
}

// Added withdrawal strategy types to support the new withdrawal phase components
export type WithdrawalFrequency = 'weekly' | 'monthly';

export interface WithdrawalInputs {
  startBalance: number;
  profitPct: number;
  tradesPerDay: number;
  frequency: WithdrawalFrequency;
  amount: number;
  periods: number;
}

export interface WithdrawalRow {
  period: number;
  before: number;
  withdrawal: number;
  after: number;
  isGrowing: boolean | null;
  date: string;
}

export interface WithdrawalResults {
  rows: WithdrawalRow[];
  isSustainable: boolean;
  failPeriod: number | null;
  firstGrowPeriod: number | null;
  statusMessage: string;
}
