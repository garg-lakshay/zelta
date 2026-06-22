"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface UploadCardProps {
  variant: "full" | "compact";
  upload: (file: File) => void;
  isUploading: boolean;
  success: boolean;
  tradesInserted: number | null;
  error: string | null;
}

export function UploadCard({
  variant,
  upload,
  isUploading,
  success,
  tradesInserted,
  error,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept=".csv"
      className="hidden"
      onChange={handleChange}
    />
  );

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {hiddenInput}
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "#6366F1", color: "#fff" }}
        >
          {isUploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={14} />
              Re-upload CSV
            </>
          )}
        </button>
        {success && (
          <p className="flex items-center gap-1 text-xs" style={{ color: "#22C55E" }}>
            <CheckCircle2 size={11} />
            {tradesInserted} trades analysed
          </p>
        )}
        {error && (
          <p className="text-xs" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hiddenInput}

      <div
        onClick={openPicker}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-all"
        style={{
          borderColor: isDragging ? "#6366F1" : "#1E1E2E",
          backgroundColor: isDragging
            ? "rgba(99,102,241,0.05)"
            : "#111118",
        }}
      >
        {isUploading ? (
          <Loader2 size={40} className="animate-spin" style={{ color: "#6366F1" }} />
        ) : (
          <Upload size={40} style={{ color: "#475569" }} />
        )}

        <div className="flex flex-col gap-1 text-center">
          <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>
            {isUploading
              ? "Uploading your trades…"
              : "Drop your CSV here or click to browse"}
          </p>
          <p className="text-xs" style={{ color: "#475569" }}>
            Supports Zerodha, Groww, Angel, and generic CSV formats
          </p>
        </div>

        <a
          href="/sample-trades.csv"
          download
          onClick={(e) => e.stopPropagation()}
          className="text-xs underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: "#6366F1" }}
        >
          Download sample CSV
        </a>
      </div>

      {success && (
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(34,197,94,0.10)",
            border: "1px solid rgba(34,197,94,0.30)",
            color: "#22C55E",
          }}
        >
          <CheckCircle2 size={16} />
          {tradesInserted} trades analysed successfully
        </div>
      )}

      {error && (
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.30)",
            color: "#EF4444",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
