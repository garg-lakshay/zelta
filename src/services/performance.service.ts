import type {
  Trade,
  PerformanceResult,
  EquityCurvePoint,
  DailyPnLPoint,
} from "@/types/analytics.types";
import { mean, getUniqueDates } from "@/lib/mathHelpers";

export function calculatePerformance(trades: Trade[]): PerformanceResult {
  const totalTrades = trades.length;

  // ── Win / loss counts ──────────────────────────────────────────────────────
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const losingTrades = trades.filter((t) => t.pnl < 0).length;

  const winRate = parseFloat(((winningTrades / totalTrades) * 100).toFixed(2));
  const lossRate = parseFloat(((losingTrades / totalTrades) * 100).toFixed(2));

  // ── PnL aggregates ─────────────────────────────────────────────────────────
  const totalPnL = parseFloat(
    trades.reduce((sum, t) => sum + t.pnl, 0).toFixed(2),
  );
  const grossProfit = parseFloat(
    trades
      .filter((t) => t.pnl > 0)
      .reduce((sum, t) => sum + t.pnl, 0)
      .toFixed(2),
  );
  const grossLoss = parseFloat(
    trades
      .filter((t) => t.pnl < 0)
      .reduce((sum, t) => sum + Math.abs(t.pnl), 0)
      .toFixed(2),
  );

  // ── Averages ───────────────────────────────────────────────────────────────
  const averageWinningTrade =
    winningTrades === 0
      ? 0
      : parseFloat((grossProfit / winningTrades).toFixed(2));

  const averageLosingTrade =
    losingTrades === 0
      ? 0
      : parseFloat((grossLoss / losingTrades).toFixed(2));

  // ── Ratios ─────────────────────────────────────────────────────────────────
  const profitFactor =
    grossLoss === 0
      ? grossProfit > 0 ? 999 : 0
      : parseFloat((grossProfit / grossLoss).toFixed(2));

  const riskRewardRatio =
    averageLosingTrade === 0
      ? 0
      : parseFloat((averageWinningTrade / averageLosingTrade).toFixed(2));

  const expectancy = parseFloat(
    (
      (winRate / 100) * averageWinningTrade -
      (lossRate / 100) * averageLosingTrade
    ).toFixed(2),
  );

  // ── Largest single trade ───────────────────────────────────────────────────
  const winningPnls = trades.filter((t) => t.pnl > 0).map((t) => t.pnl);
  const losingPnls = trades.filter((t) => t.pnl < 0).map((t) => Math.abs(t.pnl));

  const largestWinningTrade =
    winningPnls.length > 0 ? parseFloat(Math.max(...winningPnls).toFixed(2)) : 0;
  const largestLosingTrade =
    losingPnls.length > 0 ? parseFloat(Math.max(...losingPnls).toFixed(2)) : 0;

  // ── Streaks ────────────────────────────────────────────────────────────────
  let currentWinStreak = 0;
  let maxWinStreak = 0;
  let currentLoseStreak = 0;
  let maxLoseStreak = 0;

  for (const trade of trades) {
    if (trade.pnl > 0) {
      currentWinStreak++;
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      currentLoseStreak = 0;
    } else if (trade.pnl < 0) {
      currentLoseStreak++;
      maxLoseStreak = Math.max(maxLoseStreak, currentLoseStreak);
      currentWinStreak = 0;
    } else {
      currentWinStreak = 0;
      currentLoseStreak = 0;
    }
  }

  // ── Holding duration & trades per day ──────────────────────────────────────
  const averageHoldingDuration = parseFloat(
    mean(trades.map((t) => t.holdingDuration)).toFixed(2),
  );

  const uniqueDates = getUniqueDates(trades.map((t) => t.entryDate));
  const averageTradesPerDay = parseFloat(
    (totalTrades / uniqueDates.length).toFixed(2),
  );

  // ── Equity curve (cumulative PnL sorted by exit date) ─────────────────────
  const sortedByExit = [...trades].sort(
    (a, b) => a.exitDate.getTime() - b.exitDate.getTime(),
  );
  let runningTotal = 0;
  const equityCurve: EquityCurvePoint[] = sortedByExit.map((trade) => {
    runningTotal += trade.pnl;
    return {
      date: trade.exitDate.toISOString().split("T")[0],
      value: parseFloat(runningTotal.toFixed(2)),
    };
  });

  // ── Daily PnL (grouped by entry date) ─────────────────────────────────────
  const dailyMap = new Map<string, number>();
  for (const trade of trades) {
    const key = trade.entryDate.toISOString().split("T")[0];
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + trade.pnl);
  }
  const dailyPnL: DailyPnLPoint[] = Array.from(dailyMap.entries())
    .map(([date, pnl]) => ({ date, pnl: parseFloat(pnl.toFixed(2)) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    lossRate,
    totalPnL,
    grossProfit,
    grossLoss,
    averageWinningTrade,
    averageLosingTrade,
    profitFactor,
    riskRewardRatio,
    expectancy,
    largestWinningTrade,
    largestLosingTrade,
    largestWinningStreak: maxWinStreak,
    largestLosingStreak: maxLoseStreak,
    averageHoldingDuration,
    averageTradesPerDay,
    equityCurve,
    dailyPnL,
  };
}
