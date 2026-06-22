// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// ─── Trade ────────────────────────────────────────────────────────────────────

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  sector?: string;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  entryDate: string;
  exitDate: string;
  tradeValue: number;
  pnl: number;
  holdingDuration: number;
  createdAt: string;
}

// ─── Analytics JSON sub-shapes ────────────────────────────────────────────────

export interface EquityCurvePoint {
  date: string;   // "YYYY-MM-DD"
  value: number;  // cumulative PnL
}

export interface DailyPnLPoint {
  date: string;
  pnl: number;
}

export interface SectorExposurePoint {
  sector: string;
  percentage: number;
}

export interface Insight {
  type: "warning" | "tip";
  message: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface Analytics {
  id: string;
  userId: string;

  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  lossRate: number;
  totalPnL: number;
  grossProfit: number;
  grossLoss: number;
  averageWinningTrade: number;
  averageLosingTrade: number;
  profitFactor: number;
  riskRewardRatio: number;
  expectancy: number;
  largestWinningTrade: number;
  largestLosingTrade: number;
  largestWinningStreak: number;
  largestLosingStreak: number;
  averageHoldingDuration: number;
  averageTradesPerDay: number;

  maxDrawdown: number;
  averageDrawdown: number;
  sharpeRatio: number;
  calmarRatio: number;
  averagePositionSize: number;
  portfolioExposure: number;
  positionConcentration: number;
  sectorConcentration: number;

  overtradingScore: number;
  disciplineScore: number;
  emotionalScore: number;
  consistencyScore: number;
  riskScore: number;
  performanceScore: number;
  behaviourScore: number;
  masterScore: number;

  traderPersonality: string;   // "Disciplined Trader" | "Aggressive Trader" | etc.

  equityCurve: EquityCurvePoint[];
  dailyPnL: DailyPnLPoint[];
  sectorExposure: SectorExposurePoint[];
  insights: Insight[];

  createdAt: string;
  updatedAt: string;
}
