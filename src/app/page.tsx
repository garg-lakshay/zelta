"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, TrendingUp, Shield, Brain, ArrowRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = "login" | "register" | null;

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({
  mode,
  onClose,
  onSwitch,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSwitch: (m: AuthMode) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, login, register } = useAuth();

  const handleSubmit = () => {
    if (mode === "login") login(email, password);
    else register(name, email, password);
  };

  const inputCls = "w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors";
  const inputStyle: React.CSSProperties = {
    backgroundColor: "#0A0A0F",
    border: "1px solid #1E1E2E",
    color: "#F1F5F9",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,10,15,0.85)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 transition-colors hover:bg-white/5"
          style={{ color: "#475569" }}
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="mb-6">
          <span className="text-xl font-bold" style={{ color: "#6366F1" }}>
            Zelta
          </span>
        </div>

        {/* Tab switcher */}
        <div
          className="mb-6 flex rounded-lg p-1"
          style={{ backgroundColor: "#0A0A0F", border: "1px solid #1E1E2E" }}
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onSwitch(m)}
              className="flex-1 rounded-md py-2 text-sm font-medium transition-all"
              style={{
                backgroundColor: mode === m ? "#6366F1" : "transparent",
                color: mode === m ? "#fff" : "#94A3B8",
              }}
            >
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold" style={{ color: "#F1F5F9" }}>
            {mode === "login" ? "Welcome back" : "Start your analysis"}
          </h2>
          <p className="mt-0.5 text-sm" style={{ color: "#94A3B8" }}>
            {mode === "login"
              ? "Sign in to your Zelta account"
              : "Create a free account to get your score"}
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {mode === "register" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lakshay Garg"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {mode === "register" && (
              <p className="text-xs" style={{ color: "#475569" }}>
                Minimum 8 characters
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email || !password || (mode === "register" && !name)}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#6366F1", color: "#fff" }}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading
              ? mode === "login" ? "Signing in…" : "Creating account…"
              : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat card (decorative) ────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-xl p-4 transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="text-xs uppercase tracking-wider" style={{ color: "#475569" }}>
        {label}
      </p>
      <p className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div
      className="group flex flex-col gap-5 rounded-2xl p-6 transition-all hover:border-indigo-500/40"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "#6366F1" }}
      >
        {icon}
      </div>
      <div>
        <p className="font-semibold" style={{ color: "#F1F5F9" }}>
          {title}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8" }}>
              <span style={{ color: "#6366F1", fontWeight: "bold" }}>→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Comparison card ──────────────────────────────────────────────────────────

function TraderCard({
  name, profit, risk, revenge, drawdown, badge, badgeColor, isGood,
}: {
  name: string; profit: string; risk: number; revenge: number;
  drawdown: string; badge: string; badgeColor: string; isGood: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6"
      style={{
        backgroundColor: "#111118",
        border: `1px solid ${isGood ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.20)"}`,
      }}
    >
      <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>{name}</p>
      {[
        { label: "Profit", val: profit, color: "#F1F5F9" },
        { label: "Risk Score", val: `${risk}/100`, color: risk >= 60 ? "#22C55E" : "#EF4444" },
        { label: "Revenge Trades", val: String(revenge), color: revenge === 0 ? "#22C55E" : "#EF4444" },
        { label: "Max Drawdown", val: drawdown, color: parseFloat(drawdown) < 10 ? "#22C55E" : "#EF4444" },
      ].map(({ label, val, color }) => (
        <div key={label} className="flex justify-between text-sm">
          <span style={{ color: "#475569" }}>{label}</span>
          <span className="font-semibold tabular-nums" style={{ color }}>{val}</span>
        </div>
      ))}
      <span
        className="mt-1 self-start rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: badgeColor + "22", color: badgeColor }}
      >
        {badge}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) router.push("/dashboard");
  }, [_hasHydrated, isAuthenticated, router]);

  const open = (m: AuthMode) => setAuthMode(m);
  const close = () => setAuthMode(null);

  return (
    <>
      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {authMode && (
        <AuthModal mode={authMode} onClose={close} onSwitch={open} />
      )}

      {/* ── Page (blurs behind modal) ──────────────────────────────────────── */}
      <div
        className="transition-[filter] duration-300"
        style={{
          filter: authMode ? "blur(4px)" : "none",
          backgroundColor: "#0A0A0F",
          color: "#F1F5F9",
          pointerEvents: authMode ? "none" : "auto",
        }}
      >
        {/* ── Navbar ───────────────────────────────────────────────────────── */}
        <nav
          className="sticky top-0 z-40 flex h-14 items-center justify-between px-6 md:px-12"
          style={{ backgroundColor: "rgba(10,10,15,0.85)", borderBottom: "1px solid #1E1E2E", backdropFilter: "blur(12px)" }}
        >
          <span className="text-xl font-bold" style={{ color: "#6366F1" }}>Zelta</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => open("login")}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:text-white"
              style={{ color: "#94A3B8" }}
            >
              Sign in
            </button>
            <button
              onClick={() => open("register")}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6366F1", color: "#fff" }}
            >
              Get started <ArrowRight size={14} />
            </button>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 md:px-12">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6366F1 0%, transparent 70%)" }}
          />

          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-20 lg:flex-row lg:items-center">
            {/* Left */}
            <div className="flex max-w-2xl flex-col gap-7 text-center lg:text-left">
              <div>
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.25)" }}
                >
                  Trading Behaviour Analytics
                </span>
              </div>
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
                Know how you trade.
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Not just what you made.
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed" style={{ color: "#94A3B8" }}>
                Upload your trading history. Get scored on Performance, Risk, and Behaviour.
                Understand exactly why you win — or lose.
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <button
                  onClick={() => open("register")}
                  className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-indigo-500/25"
                  style={{ backgroundColor: "#6366F1", color: "#fff", boxShadow: "0 4px 24px rgba(99,102,241,0.3)" }}
                >
                  Analyse my trades <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => open("login")}
                  className="rounded-xl px-7 py-3.5 text-sm font-semibold transition-all hover:border-indigo-500/50"
                  style={{ border: "1px solid #1E1E2E", color: "#94A3B8" }}
                >
                  Sign in
                </button>
              </div>
            </div>

            {/* Right — mock score preview */}
            <div className="flex w-full max-w-xs flex-col gap-3">
              {/* Master score ring mock */}
              <div
                className="flex flex-col items-center gap-4 rounded-2xl p-6"
                style={{
                  backgroundColor: "#111118",
                  border: "1px solid #1E1E2E",
                  boxShadow: "0 0 40px rgba(99,102,241,0.08)",
                }}
              >
                <div className="relative flex items-center justify-center">
                  <svg viewBox="0 0 120 120" width={140} height={140}>
                    <circle cx={60} cy={60} r={54} fill="none" stroke="#1E1E2E" strokeWidth={8} />
                    <circle
                      cx={60} cy={60} r={54}
                      fill="none" stroke="#6366F1" strokeWidth={8}
                      strokeLinecap="round"
                      strokeDasharray={339.29}
                      strokeDashoffset={339.29 * 0.26}
                      transform="rotate(-90 60 60)"
                    />
                    <text x={60} y={55} textAnchor="middle" dominantBaseline="middle" fill="#F1F5F9" fontSize={26} fontWeight="bold">74</text>
                    <text x={60} y={74} textAnchor="middle" fill="#94A3B8" fontSize={10}>/100</text>
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>Developing Trader</span>
                  <span className="text-xs" style={{ color: "#475569" }}>Master Trader Score</span>
                  <span className="mt-1 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#FCD34D" }}>
                    Momentum Trader
                  </span>
                </div>
              </div>

              {/* Mini metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard label="Win Rate" value="61%" color="#22C55E" />
                <StatCard label="Profit Factor" value="2.3×" color="#6366F1" />
                <StatCard label="Risk Score" value="68/100" color="#F59E0B" />
                <StatCard label="Discipline" value="72/100" color="#6366F1" />
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 flex justify-center" style={{ color: "#475569" }}>
            <ChevronDown size={20} className="animate-bounce" />
          </div>
        </section>

        {/* ── Problem section ───────────────────────────────────────────────── */}
        <section
          className="px-6 py-20 md:px-12"
          style={{ backgroundColor: "#111118", borderTop: "1px solid #1E1E2E", borderBottom: "1px solid #1E1E2E" }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6366F1" }}>
                The Problem
              </span>
            </div>
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">
              Profit alone doesn&apos;t get you funded
            </h2>
            <p className="mb-12 text-center text-base" style={{ color: "#94A3B8" }}>
              Prop firms care about how you trade, not just what you made.
            </p>
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_56px_1fr]">
              <TraderCard name="Trader A" profit="₹20,000" risk={28} revenge={6} drawdown="24%" badge="Would not be funded" badgeColor="#EF4444" isGood={false} />
              <div className="flex justify-center">
                <span className="text-3xl font-black" style={{ color: "#1E1E2E" }}>VS</span>
              </div>
              <TraderCard name="Trader B" profit="₹15,000" risk={84} revenge={0} drawdown="6%" badge="Fundable trader" badgeColor="#22C55E" isGood={true} />
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6366F1" }}>
                What you get
              </span>
            </div>
            <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">
              Everything you need to improve
            </h2>
            <p className="mb-12 text-center text-base" style={{ color: "#94A3B8" }}>
              Three scores. One master score. Complete clarity.
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <FeatureCard
                icon={<TrendingUp size={22} />}
                title="Performance Analytics"
                items={["Win rate & profit factor", "Expectancy per trade", "Streak analysis", "Equity curve"]}
              />
              <FeatureCard
                icon={<Shield size={22} />}
                title="Risk Analytics"
                items={["Max & average drawdown", "Sharpe & Calmar ratios", "Sector concentration", "Position sizing"]}
              />
              <FeatureCard
                icon={<Brain size={22} />}
                title="Behaviour Scores"
                items={["Overtrading detection", "Discipline score", "Emotional control", "Consistency rating"]}
              />
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section
          className="px-6 py-24 text-center md:px-12"
          style={{ backgroundColor: "#111118", borderTop: "1px solid #1E1E2E" }}
        >
          <div className="mx-auto max-w-xl">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
              Ready to understand{" "}
              <span style={{ color: "#6366F1" }}>your edge?</span>
            </h2>
            <p className="mb-8 text-base" style={{ color: "#94A3B8" }}>
              Upload your trades in seconds. Get your full score instantly.
              No credit card required.
            </p>
            <button
              onClick={() => open("register")}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: "#6366F1", color: "#fff", boxShadow: "0 4px 24px rgba(99,102,241,0.30)" }}
            >
              Upload your trades free <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer
          className="flex flex-col items-center justify-between gap-3 px-6 py-6 text-xs sm:flex-row md:px-12"
          style={{ borderTop: "1px solid #1E1E2E", color: "#475569" }}
        >
          <span className="font-bold text-sm" style={{ color: "#6366F1" }}>Zelta</span>
          <span>Trading Behaviour Analytics Platform</span>
          <span>
            Made with ♥ by{" "}
            <span className="font-semibold" style={{ color: "#94A3B8" }}>
              Lakshay Garg
            </span>
          </span>
        </footer>
      </div>
    </>
  );
}
