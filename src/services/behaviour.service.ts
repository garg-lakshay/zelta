import type {
  Trade,
  PerformanceResult,
  RiskResult,
  BehaviourResult,
} from "@/types/analytics.types";
import { mean, standardDeviation, clamp } from "@/lib/mathHelpers";

export function calculateBehaviour(
  trades: Trade[],
  performance: PerformanceResult,
  risk: RiskResult,
): BehaviourResult {
  // Ensure trades are sorted by entryDate ascending for streak/revenge logic
  const sorted = [...trades].sort(
    (a, b) => a.entryDate.getTime() - b.entryDate.getTime(),
  );

  // ── Revenge trading detection ──────────────────────────────────────────────
  // A revenge trade = entered within 10 minutes after a loss AND position
  // size increased by more than 50%.
  let revengeCount = 0;
  for (let i = 0; i < sorted.length; i++) {
    const trade = sorted[i];
    if (trade.pnl < 0) {
      const next = sorted[i + 1];
      if (next) {
        const minutesGap =
          (next.entryDate.getTime() - trade.exitDate.getTime()) / 60_000;
        const sizeIncreased = next.tradeValue > trade.tradeValue * 1.5;
        if (minutesGap < 10 && sizeIncreased) revengeCount++;
      }
    }
  }

  // ── Overtrading score ──────────────────────────────────────────────────────
  let overtradingScore = 100;
  const avgPerDay = performance.averageTradesPerDay;
  if (avgPerDay > 15) overtradingScore -= 30;
  else if (avgPerDay > 10) overtradingScore -= 20;
  else if (avgPerDay > 6) overtradingScore -= 10;
  overtradingScore = clamp(overtradingScore, 0, 100);

  // ── Discipline score ───────────────────────────────────────────────────────
  let disciplineScore = 100;
  if (performance.averageTradesPerDay > 10) disciplineScore -= 10;
  if (risk.positionConcentration > 3_000) disciplineScore -= 10;
  if (performance.largestLosingStreak >= 3) disciplineScore -= 10;
  if (revengeCount > 0) disciplineScore -= 20;
  if (risk.maxDrawdown > 20) disciplineScore -= 10;
  disciplineScore = clamp(disciplineScore, 0, 100);

  // ── Emotional score ────────────────────────────────────────────────────────
  let emotionalScore = 100;
  if (revengeCount > 0) emotionalScore -= 20;
  if (risk.maxDrawdown > 20) emotionalScore -= 15;
  if (performance.averageTradesPerDay > 10) emotionalScore -= 15;
  if (performance.largestLosingStreak >= 5) emotionalScore -= 15;
  if (performance.profitFactor < 1) emotionalScore -= 10;
  emotionalScore = clamp(emotionalScore, 0, 100);

  // ── Consistency score ──────────────────────────────────────────────────────
  const dailyPnLValues = performance.dailyPnL.map((d) => d.pnl);
  const dailyMean = mean(dailyPnLValues);
  const dailyStdDev = standardDeviation(dailyPnLValues);
  const CV = dailyMean === 0 ? 0 : dailyStdDev / Math.abs(dailyMean);
  const cvScore = Math.max(0, 100 - CV * 50);
  const profitableDays = dailyPnLValues.filter((p) => p > 0).length;
  const profitableDaysRate =
    dailyPnLValues.length > 0 ? profitableDays / dailyPnLValues.length : 0;
  const consistencyScore = clamp(
    Math.round(cvScore * 0.5 + profitableDaysRate * 100 * 0.5),
    0,
    100,
  );

  // ── Trader personality (checked in exact spec order) ──────────────────────
  let traderPersonality: string;
  if (
    risk.riskScore > 80 &&
    disciplineScore > 80 &&
    risk.maxDrawdown < 10
  ) {
    traderPersonality = "Disciplined Trader";
  } else if (
    performance.averageTradesPerDay < 5 &&
    risk.maxDrawdown < 10
  ) {
    traderPersonality = "Conservative Trader";
  } else if (
    performance.averageTradesPerDay > 10 ||
    risk.maxDrawdown > 20
  ) {
    traderPersonality = "Aggressive Trader";
  } else if (
    performance.winRate > 60 &&
    performance.riskRewardRatio > 2
  ) {
    traderPersonality = "Momentum Trader";
  } else {
    traderPersonality = "Developing Trader";
  }

  return {
    revengeCount,
    overtradingScore,
    disciplineScore,
    emotionalScore,
    consistencyScore,
    traderPersonality,
  };
}
