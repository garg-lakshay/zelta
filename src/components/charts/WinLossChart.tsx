interface WinLossChartProps {
  winningTrades: number;
  losingTrades: number;
}

export function WinLossChart({ winningTrades, losingTrades }: WinLossChartProps) {
  const total = winningTrades + losingTrades;
  const winPct = total > 0 ? (winningTrades / total) * 100 : 0;
  const losePct = total > 0 ? (losingTrades / total) * 100 : 0;

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="mb-4 text-sm" style={{ color: "#94A3B8" }}>
        Win vs Loss
      </p>

      <div className="flex flex-col gap-4">
        {/* Wins */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span style={{ color: "#22C55E" }}>Wins</span>
            <span style={{ color: "#22C55E" }}>
              {winningTrades} ({winPct.toFixed(1)}%)
            </span>
          </div>
          <div
            className="h-7 w-full overflow-hidden rounded"
            style={{ backgroundColor: "#1E1E2E" }}
          >
            <div
              className="flex h-7 items-center rounded px-2 transition-all duration-700"
              style={{
                width: `${Math.max(winPct, 3)}%`,
                backgroundColor: "#22C55E",
              }}
            >
              <span className="text-xs font-semibold" style={{ color: "#0A0A0F" }}>
                {winningTrades}
              </span>
            </div>
          </div>
        </div>

        {/* Losses */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span style={{ color: "#EF4444" }}>Losses</span>
            <span style={{ color: "#EF4444" }}>
              {losingTrades} ({losePct.toFixed(1)}%)
            </span>
          </div>
          <div
            className="h-7 w-full overflow-hidden rounded"
            style={{ backgroundColor: "#1E1E2E" }}
          >
            <div
              className="flex h-7 items-center rounded px-2 transition-all duration-700"
              style={{
                width: `${Math.max(losePct, 3)}%`,
                backgroundColor: "#EF4444",
              }}
            >
              <span className="text-xs font-semibold" style={{ color: "#fff" }}>
                {losingTrades}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: "#475569" }}>
          {total} total trades
        </p>
      </div>
    </div>
  );
}
