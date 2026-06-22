interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "positive" | "negative" | "neutral";
  size?: "sm" | "md";
}

export function MetricCard({
  label,
  value,
  subValue,
  trend = "neutral",
}: MetricCardProps) {
  const valueColor =
    trend === "positive"
      ? "#22C55E"
      : trend === "negative"
        ? "#EF4444"
        : "#F1F5F9";

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "#94A3B8" }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-2xl font-bold tabular-nums"
        style={{ color: valueColor }}
      >
        {value}
      </p>
      {subValue && (
        <p className="mt-0.5 text-xs" style={{ color: "#475569" }}>
          {subValue}
        </p>
      )}
    </div>
  );
}
