import type {
  Trade,
  PerformanceResult,
  RiskResult,
  SectorPoint,
} from "@/types/analytics.types";
import { mean, standardDeviation, clamp, getUniqueDates } from "@/lib/mathHelpers";

const STARTING_CAPITAL = 100_000;

export function calculateRisk(
  trades: Trade[],
  performance: PerformanceResult,
): RiskResult {
  // ── Max Drawdown ───────────────────────────────────────────────────────────
  let peak = 0;
  let maxDD = 0;
  for (const point of performance.equityCurve) {
    if (point.value > peak) peak = point.value;
    if (peak > 0) {
      const dd = ((peak - point.value) / peak) * 100;
      maxDD = Math.max(maxDD, dd);
    }
  }
  const maxDrawdown = parseFloat(maxDD.toFixed(2));

  // ── Average Drawdown (episode-based) ──────────────────────────────────────
  let ddPeak = 0;
  let inDrawdown = false;
  let episodeMax = 0;
  const episodes: number[] = [];

  for (const point of performance.equityCurve) {
    if (point.value > ddPeak) {
      if (inDrawdown && episodeMax > 0) episodes.push(episodeMax);
      ddPeak = point.value;
      inDrawdown = false;
      episodeMax = 0;
    } else if (ddPeak > 0 && point.value < ddPeak) {
      inDrawdown = true;
      const dd = ((ddPeak - point.value) / ddPeak) * 100;
      episodeMax = Math.max(episodeMax, dd);
    }
  }
  if (inDrawdown && episodeMax > 0) episodes.push(episodeMax);
  const averageDrawdown = parseFloat(mean(episodes).toFixed(2));

  // ── Sharpe Ratio ───────────────────────────────────────────────────────────
  const dailyPnLValues = performance.dailyPnL.map((d) => d.pnl);
  const dailyReturns = dailyPnLValues.map((p) => p / STARTING_CAPITAL);
  const meanReturn = mean(dailyReturns);
  const stdDev = standardDeviation(dailyReturns);
  const riskFreeDaily = 0.065 / 252;
  const sharpeRatio =
    stdDev === 0
      ? 0
      : parseFloat(
          (((meanReturn - riskFreeDaily) / stdDev) * Math.sqrt(252)).toFixed(2),
        );

  // ── Calmar Ratio ───────────────────────────────────────────────────────────
  const uniqueDates = getUniqueDates(trades.map((t) => t.entryDate));
  const annualisedReturn =
    (performance.totalPnL / STARTING_CAPITAL) *
    (365 / uniqueDates.length) *
    100;
  const calmarRatio =
    maxDrawdown === 0
      ? 0
      : parseFloat((annualisedReturn / maxDrawdown).toFixed(2));

  // ── Position size metrics ──────────────────────────────────────────────────
  const averagePositionSize = parseFloat(
    mean(trades.map((t) => t.tradeValue)).toFixed(2),
  );
  const portfolioExposure = parseFloat(
    ((averagePositionSize / STARTING_CAPITAL) * 100).toFixed(2),
  );

  // ── Position Concentration (HHI) ──────────────────────────────────────────
  const totalTradeValue = trades.reduce((sum, t) => sum + t.tradeValue, 0);
  const symbolGroups = new Map<string, number>();
  for (const trade of trades) {
    symbolGroups.set(
      trade.symbol,
      (symbolGroups.get(trade.symbol) ?? 0) + trade.tradeValue,
    );
  }
  let hhi = 0;
  for (const symValue of symbolGroups.values()) {
    const weight = (symValue / totalTradeValue) * 100;
    hhi += weight * weight;
  }
  const positionConcentration = parseFloat(hhi.toFixed(2));

  // ── Sector Concentration & Exposure ───────────────────────────────────────
  const tradesWithSector = trades.filter((t) => t.sector !== null);
  let sectorConcentration = 0;
  const sectorExposure: SectorPoint[] = [];

  if (tradesWithSector.length > 0) {
    const sectorGroups = new Map<string, number>();
    for (const trade of tradesWithSector) {
      const s = trade.sector!;
      sectorGroups.set(s, (sectorGroups.get(s) ?? 0) + trade.tradeValue);
    }
    const sectorTotal = tradesWithSector.reduce((sum, t) => sum + t.tradeValue, 0);
    const pcts: number[] = [];
    for (const [sector, value] of sectorGroups.entries()) {
      const pct = parseFloat(((value / sectorTotal) * 100).toFixed(2));
      pcts.push(pct);
      sectorExposure.push({ sector, percentage: pct });
    }
    sectorExposure.sort((a, b) => b.percentage - a.percentage);
    sectorConcentration = Math.max(...pcts);
  }

  // ── Risk Score ─────────────────────────────────────────────────────────────
  let riskScore = 100;
  if (maxDrawdown > 20) riskScore -= 20;
  if (sectorConcentration > 60) riskScore -= 20;
  if (averagePositionSize > STARTING_CAPITAL * 0.3) riskScore -= 15;
  if (performance.largestLosingStreak >= 3) riskScore -= 15;
  if (portfolioExposure > 50) riskScore -= 10;
  riskScore = clamp(riskScore, 0, 100);

  return {
    maxDrawdown,
    averageDrawdown,
    sharpeRatio,
    calmarRatio,
    averagePositionSize,
    portfolioExposure,
    positionConcentration,
    sectorConcentration,
    sectorExposure,
    riskScore,
  };
}
