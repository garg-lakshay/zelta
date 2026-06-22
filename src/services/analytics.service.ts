import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { calculatePerformance } from "@/services/performance.service";
import { calculateRisk } from "@/services/risk.service";
import { calculateBehaviour } from "@/services/behaviour.service";
import { generateInsights } from "@/services/insight.service";
import type {
  Trade,
  PerformanceResult,
  BehaviourResult,
} from "@/types/analytics.types";

// Casts a typed array to Prisma's Json input type without serialisation overhead.
function asJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

// ─── Composite score calculators ─────────────────────────────────────────────

function calculatePerformanceScore(p: PerformanceResult): number {
  const PF = p.profitFactor;
  let profitFactorScore: number;
  if (PF < 1) profitFactorScore = 0;
  else if (PF <= 1.5) profitFactorScore = ((PF - 1) / 0.5) * 40;
  else if (PF <= 3) profitFactorScore = 40 + ((PF - 1.5) / 1.5) * 60;
  else profitFactorScore = 100;

  const winRateScore = Math.min(100, p.winRate * 1.2);
  const expectancyScore = p.expectancy > 0 ? Math.min(100, p.expectancy / 5) : 0;
  const rrrScore = Math.min(100, p.riskRewardRatio * 33.3);

  return Math.round(
    profitFactorScore * 0.3 +
      winRateScore * 0.25 +
      expectancyScore * 0.25 +
      rrrScore * 0.2,
  );
}

function calculateBehaviourScore(b: BehaviourResult): number {
  return Math.round(
    b.disciplineScore * 0.3 +
      b.consistencyScore * 0.3 +
      b.emotionalScore * 0.2 +
      b.overtradingScore * 0.2,
  );
}

function calculateMasterScore(
  performanceScore: number,
  riskScore: number,
  behaviourScore: number,
): number {
  return Math.round(
    performanceScore * 0.4 + riskScore * 0.35 + behaviourScore * 0.25,
  );
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

export async function generateAnalytics(userId: string): Promise<void> {
  // Step 1 — Fetch trades from DB (ordered chronologically)
  const rawTrades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { entryDate: "asc" },
  });

  if (rawTrades.length === 0) throw new Error("No trades found for user");

  const trades = rawTrades as Trade[];

  // Step 2 — Run services in dependency order
  const performance = calculatePerformance(trades);
  const risk = calculateRisk(trades, performance);
  const behaviour = calculateBehaviour(trades, performance, risk);

  // Step 3 — Composite scores (masterScore needed before insights)
  const performanceScore = calculatePerformanceScore(performance);
  const behaviourScore = calculateBehaviourScore(behaviour);
  const masterScore = calculateMasterScore(
    performanceScore,
    risk.riskScore,
    behaviourScore,
  );

  // Step 4 — AI insights (uses masterScore)
  const insights = await generateInsights({
    winRate: performance.winRate,
    profitFactor: performance.profitFactor,
    maxDrawdown: risk.maxDrawdown,
    disciplineScore: behaviour.disciplineScore,
    emotionalScore: behaviour.emotionalScore,
    riskScore: risk.riskScore,
    masterScore,
    traderPersonality: behaviour.traderPersonality,
    largestLosingStreak: performance.largestLosingStreak,
    revengeCount: behaviour.revengeCount,
    averageTradesPerDay: performance.averageTradesPerDay,
    expectancy: performance.expectancy,
  });

  // Step 5 — Build the payload (userId only in create, not in update)
  const payload = {
    totalTrades: performance.totalTrades,
    winningTrades: performance.winningTrades,
    losingTrades: performance.losingTrades,
    winRate: performance.winRate,
    lossRate: performance.lossRate,
    totalPnL: performance.totalPnL,
    grossProfit: performance.grossProfit,
    grossLoss: performance.grossLoss,
    averageWinningTrade: performance.averageWinningTrade,
    averageLosingTrade: performance.averageLosingTrade,
    profitFactor: performance.profitFactor,
    riskRewardRatio: performance.riskRewardRatio,
    expectancy: performance.expectancy,
    largestWinningTrade: performance.largestWinningTrade,
    largestLosingTrade: performance.largestLosingTrade,
    largestWinningStreak: performance.largestWinningStreak,
    largestLosingStreak: performance.largestLosingStreak,
    averageHoldingDuration: performance.averageHoldingDuration,
    averageTradesPerDay: performance.averageTradesPerDay,
    maxDrawdown: risk.maxDrawdown,
    averageDrawdown: risk.averageDrawdown,
    sharpeRatio: risk.sharpeRatio,
    calmarRatio: risk.calmarRatio,
    averagePositionSize: risk.averagePositionSize,
    portfolioExposure: risk.portfolioExposure,
    positionConcentration: risk.positionConcentration,
    sectorConcentration: risk.sectorConcentration,
    overtradingScore: behaviour.overtradingScore,
    disciplineScore: behaviour.disciplineScore,
    emotionalScore: behaviour.emotionalScore,
    consistencyScore: behaviour.consistencyScore,
    riskScore: risk.riskScore,
    performanceScore,
    behaviourScore,
    masterScore,
    traderPersonality: behaviour.traderPersonality,
    equityCurve: asJson(performance.equityCurve),
    dailyPnL: asJson(performance.dailyPnL),
    sectorExposure: asJson(risk.sectorExposure),
    insights: asJson(insights),
  };

  // Step 6 — Upsert into Analytics table
  await prisma.analytics.upsert({
    where: { userId },
    update: payload,
    create: { userId, ...payload },
  });
}
