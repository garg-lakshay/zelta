interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="rounded-lg px-4 py-3 text-sm"
      style={{
        backgroundColor: "rgba(239,68,68,0.10)",
        border: "1px solid rgba(239,68,68,0.30)",
        color: "#EF4444",
      }}
    >
      {message}
    </div>
  );
}
