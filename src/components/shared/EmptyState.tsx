import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      {icon && (
        <div style={{ color: "#475569" }} className="mb-2">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold" style={{ color: "#F1F5F9" }}>
          {title}
        </h3>
        <p className="max-w-sm text-sm" style={{ color: "#94A3B8" }}>
          {description}
        </p>
      </div>
      {action && <div className="mt-4 w-full max-w-lg">{action}</div>}
    </div>
  );
}
