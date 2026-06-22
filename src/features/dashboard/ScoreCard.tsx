function scoreColor(score: number): string {
  if (score >= 75) return "#6366F1";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

interface ScoreCardProps {
  label: string;
  score: number;
  description?: string;
}

export function ScoreCard({ label, score, description }: ScoreCardProps) {
  const color = scoreColor(score);
  const rounded = Math.round(score);

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-5"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="text-sm" style={{ color: "#94A3B8" }}>
        {label}
      </p>
      <p className="text-3xl font-bold tabular-nums" style={{ color }}>
        {rounded}
      </p>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "#1E1E2E" }}
      >
        <div
          className="h-1 rounded-full transition-all duration-700"
          style={{ width: `${rounded}%`, backgroundColor: color }}
        />
      </div>
      {description && (
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
          {description}
        </p>
      )}
    </div>
  );
}
