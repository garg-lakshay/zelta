"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const inputStyle: React.CSSProperties = {
  backgroundColor: "#0A0A0F",
  border: "1px solid #1E1E2E",
  color: "#F1F5F9",
  outline: "none",
  width: "100%",
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, register } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "#F1F5F9" }}
        >
          Create your account
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#94A3B8" }}>
          Start understanding how you trade
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "#94A3B8" }}
          >
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lakshay Garg"
            className="rounded-lg px-3 py-2.5 text-sm"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "#94A3B8" }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg px-3 py-2.5 text-sm"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "#94A3B8" }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-lg px-3 py-2.5 text-sm"
            style={inputStyle}
          />
          <p className="text-xs" style={{ color: "#475569" }}>
            Minimum 8 characters
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={() => register(name, email, password)}
          disabled={isLoading || !name || !email || !password}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#6366F1", color: "#fff" }}
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </div>

      <p className="text-center text-sm" style={{ color: "#94A3B8" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium transition-opacity hover:opacity-80"
          style={{ color: "#6366F1" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
