interface InsightCardProps {
  type: "warning" | "tip";
  message: string;
}

export function InsightCard({ type, message }: InsightCardProps) {
  const isWarning = type === "warning";

  return (
    <div
      className="flex items-start gap-3 rounded-lg px-4 py-3"
      style={{
        backgroundColor: isWarning
          ? "rgba(239,68,68,0.08)"
          : "rgba(99,102,241,0.08)",
        borderLeft: `3px solid ${isWarning ? "#EF4444" : "#6366F1"}`,
      }}
    >
      <span className="mt-0.5 flex-shrink-0 text-base">
        {isWarning ? "⚠️" : "💡"}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: "#F1F5F9" }}>
        {message}
      </p>
    </div>
  );
}
