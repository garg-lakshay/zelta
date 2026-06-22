interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ text, size = "md" }: LoadingSpinnerProps) {
  const dim = size === "sm" ? 24 : size === "lg" ? 48 : 36;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="animate-spin rounded-full border-4"
        style={{
          width: dim,
          height: dim,
          borderColor: "#1E1E2E",
          borderTopColor: "#6366F1",
          borderRightColor: "#6366F1",
        }}
      />
      {text && (
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          {text}
        </p>
      )}
    </div>
  );
}
