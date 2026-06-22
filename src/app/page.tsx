import Link from "next/link";

// ─── Decorative mock card ─────────────────────────────────────────────────────

function MockScoreCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#0A0A0F", border: "1px solid #1E1E2E" }}
    >
      <p className="text-xs uppercase tracking-wider" style={{ color: "#475569" }}>
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// ─── Problem card ─────────────────────────────────────────────────────────────

function TraderCard({
  name,
  profit,
  risk,
  revenge,
  drawdown,
  badge,
  badgeColor,
}: {
  name: string;
  profit: string;
  risk: number;
  revenge: number;
  drawdown: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-6"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="text-sm font-semibold" style={{ color: "#94A3B8" }}>
        {name}
      </p>
      <div className="flex flex-col gap-2.5">
        <Row label="Profit" value={profit} valueColor="#F1F5F9" />
        <Row
          label="Risk Score"
          value={`${risk}/100`}
          valueColor={risk >= 60 ? "#22C55E" : "#EF4444"}
        />
        <Row
          label="Revenge Trades"
          value={String(revenge)}
          valueColor={revenge === 0 ? "#22C55E" : "#EF4444"}
        />
        <Row
          label="Max Drawdown"
          value={drawdown}
          valueColor={
            parseFloat(drawdown) < 10 ? "#22C55E" : "#EF4444"
          }
        />
      </div>
      <span
        className="mt-1 self-start rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: badgeColor + "22", color: badgeColor }}
      >
        {badge}
      </span>
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: "#475569" }}>{label}</span>
      <span className="font-medium tabular-nums" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-6"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="font-semibold" style={{ color: "#F1F5F9" }}>
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8" }}>
            <span style={{ color: "#6366F1" }}>→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: "#0A0A0F", color: "#F1F5F9" }}>
      {/* ── SECTION 1 — Hero ─────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col px-6 py-8"
        style={{ backgroundColor: "#0A0A0F" }}
      >
        {/* Logo */}
        <div>
          <span className="text-xl font-bold" style={{ color: "#6366F1" }}>
            Zelta
          </span>
        </div>

        {/* Hero content */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-16 py-20 lg:flex-row lg:gap-24">
          {/* Left */}
          <div className="flex max-w-xl flex-col gap-6">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#94A3B8" }}
            >
              Trading Behaviour Analytics
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Know how you trade.
              <br />
              <span style={{ color: "#6366F1" }}>Not just what you made.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed" style={{ color: "#94A3B8" }}>
              Upload your trading history. Get scored on Performance, Risk, and
              Behaviour. Understand why you win — or lose.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/register"
                className="rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#6366F1", color: "#fff" }}
              >
                Analyse my trades
              </Link>
              <Link
                href="/login"
                className="rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
                style={{
                  border: "1px solid #1E1E2E",
                  color: "#94A3B8",
                }}
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right — decorative score preview */}
          <div className="flex w-full max-w-sm flex-col gap-4">
            {/* Master Score mock */}
            <div
              className="flex flex-col items-center gap-3 rounded-xl p-6"
              style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full"
                  style={{ border: "6px solid #6366F1", background: "#0A0A0F" }}
                >
                  <span className="text-4xl font-bold tabular-nums" style={{ color: "#F1F5F9" }}>
                    74
                  </span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#6366F1" }}>
                  Developing Trader
                </p>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Master Trader Score
                </p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: "rgba(245,158,11,0.2)", color: "#FCD34D" }}
              >
                Momentum Trader
              </span>
            </div>

            {/* Mini metrics */}
            <div className="grid grid-cols-2 gap-3">
              <MockScoreCard label="Win Rate" value="61%" color="#22C55E" />
              <MockScoreCard label="Profit Factor" value="2.3" color="#6366F1" />
              <MockScoreCard label="Risk Score" value="68/100" color="#F59E0B" />
              <MockScoreCard label="Discipline" value="72/100" color="#6366F1" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — The Problem ──────────────────────────────────────── */}
      <section
        className="px-6 py-20"
        style={{ backgroundColor: "#111118", borderTop: "1px solid #1E1E2E" }}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Profit alone doesn&apos;t tell the story
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr]">
            <TraderCard
              name="Trader A"
              profit="₹20,000"
              risk={28}
              revenge={6}
              drawdown="24%"
              badge="Would not be funded"
              badgeColor="#EF4444"
            />
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold" style={{ color: "#475569" }}>
                VS
              </span>
            </div>
            <TraderCard
              name="Trader B"
              profit="₹15,000"
              risk={84}
              revenge={0}
              drawdown="6%"
              badge="Fundable trader"
              badgeColor="#22C55E"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Features ─────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#0A0A0F" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Everything you need to improve
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              title="Performance Analytics"
              items={[
                "Win rate & profit factor",
                "Expectancy per trade",
                "Streak analysis",
                "Equity curve",
              ]}
            />
            <FeatureCard
              title="Risk Analytics"
              items={[
                "Max & average drawdown",
                "Sharpe & Calmar ratios",
                "Sector concentration",
                "Position sizing",
              ]}
            />
            <FeatureCard
              title="Behaviour Scores"
              items={[
                "Overtrading detection",
                "Discipline score",
                "Emotional control",
                "Consistency rating",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — CTA ──────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center gap-6 px-6 py-24 text-center"
        style={{ backgroundColor: "#111118", borderTop: "1px solid #1E1E2E" }}
      >
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to understand your edge?
        </h2>
        <p className="max-w-md text-base" style={{ color: "#94A3B8" }}>
          Upload your trades in seconds. No credit card required.
        </p>
        <Link
          href="/register"
          className="rounded-lg px-8 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#6366F1", color: "#fff" }}
        >
          Upload your trades free
        </Link>
      </section>
    </main>
  );
}
