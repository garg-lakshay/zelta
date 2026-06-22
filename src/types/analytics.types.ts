// ─── Shared JSON shape types ─────────────────────────────────────────────────

export interface EquityCurvePoint {
  date: string;   // "YYYY-MM-DD"
  value: number;  // cumulative PnL
}

export interface DailyPnLPoint {
  date: string;   // "YYYY-MM-DD"
  pnl: number;
}

export interface SectorPoint {
  sector: string;
  percentage: number;
}

export interface InsightItem {
  type: "warning" | "tip";
  message: string;
}

// ─── Internal Trade shape used by service functions ───────────────────────────
// Mirrors the Prisma Trade model exactly — keeps services decoupled from ORM.

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  sector: string | null;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  entryDate: Date;
  exitDate: Date;
  tradeValue: number;
  pnl: number;
  holdingDuration: number;
  createdAt: Date;
}

// ─── Service return types ─────────────────────────────────────────────────────

export interface PerformanceResult {
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
  equityCurve: EquityCurvePoint[];
  dailyPnL: DailyPnLPoint[];
}

export interface RiskResult {
  maxDrawdown: number;
  averageDrawdown: number;
  sharpeRatio: number;
  calmarRatio: number;
  averagePositionSize: number;
  portfolioExposure: number;
  positionConcentration: number;
  sectorConcentration: number;
  sectorExposure: SectorPoint[];
  riskScore: number;
}

export interface BehaviourResult {
  revengeCount: number;
  overtradingScore: number;
  disciplineScore: number;
  emotionalScore: number;
  consistencyScore: number;
  traderPersonality: string;
}

// ─── Gemini insight types ─────────────────────────────────────────────────────

export interface InsightInput {
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  disciplineScore: number;
  emotionalScore: number;
  riskScore: number;
  masterScore: number;
  traderPersonality: string;
  largestLosingStreak: number;
  revengeCount: number;
  averageTradesPerDay: number;
  expectancy: number;
}
