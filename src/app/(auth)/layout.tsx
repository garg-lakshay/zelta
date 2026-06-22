import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0A0A0F" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          backgroundColor: "#111118",
          border: "1px solid #1E1E2E",
        }}
      >
        {/* Logo */}
        <div className="mb-8">
          <span className="text-xl font-bold" style={{ color: "#6366F1" }}>
            Zelta
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
