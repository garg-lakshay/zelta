"use client";

import { Upload } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import { useUpload } from "@/hooks/useUpload";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

import { UploadCard } from "@/features/upload/UploadCard";
import { ScoreRing } from "@/features/dashboard/ScoreRing";
import { MetricCard } from "@/features/dashboard/MetricCard";
import { ScoreCard } from "@/features/dashboard/ScoreCard";
import { InsightCard } from "@/features/dashboard/InsightCard";

import { EquityCurveChart } from "@/components/charts/EquityCurveChart";
import { DailyPnLChart } from "@/components/charts/DailyPnLChart";
import { SectorPieChart } from "@/components/charts/SectorPieChart";
import { WinLossChart } from "@/components/charts/WinLossChart";

import { formatCurrency, formatPercent } from "@/lib/utils";
import { formatDate, getGrade } from "@/utils";

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: "#94A3B8" }}
    >
      {children}
    </h2>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { analytics, isLoading, error, refetch } = useDashboard();
  const {
    isUploading,
    error: uploadError,
    success,
    tradesInserted,
    upload,
  } = useUpload(refetch);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LoadingSpinner text="Loading your analytics…" size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-2 text-center">
        <p className="font-medium" style={{ color: "#EF4444" }}>
          Failed to load dashboard
        </p>
        <p className="text-sm" style={{ color: "#475569" }}>
          {error}
        </p>
      </div>
    );
  }

  // Empty state — no analytics yet
  if (!analytics) {
    return (
      <EmptyState
        icon={<Upload size={48} />}
        title="No trading data yet"
        description="Upload your trading history CSV to get your full performance, risk, and behaviour score."
        action={
          <UploadCard
            variant="full"
            upload={upload}
            isUploading={isUploading}
            success={success}
            tradesInserted={tradesInserted}
            error={uploadError}
          />
        }
      />
    );
  }

  const grade = getGrade(analytics.masterScore);
  const hasSectors = analytics.sectorExposure.length > 0;

  return (
    <div className="flex flex-col gap-10">
      {/* ── Row 1: Last updated + compact upload ─────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-sm" style={{ color: "#475569" }}>
          Last updated {formatDate(analytics.updatedAt)}
        </p>
        <UploadCard
          variant="compact"
          upload={upload}
          isUploading={isUploading}
          success={success}
          tradesInserted={tradesInserted}
          error={uploadError}
        />
      </div>

      {/* ── Row 2: Master Score ring + 6 key metrics ──────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Score ring */}
        <div
          className="flex items-center justify-center rounded-xl p-6"
          style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
        >
          <ScoreRing
            score={analytics.masterScore}
            grade={grade}
            personality={analytics.traderPersonality}
          />
        </div>

        {/* 2×3 metric grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-2">
          <MetricCard
            label="Total P&L"
            value={formatCurrency(analytics.totalPnL)}
            trend={analytics.totalPnL >= 0 ? "positive" : "negative"}
          />
          <MetricCard
            label="Win Rate"
            value={`${analytics.winRate.toFixed(1)}%`}
          />
          <MetricCard
            label="Profit Factor"
            value={
              analytics.profitFactor >= 999
                ? "∞"
                : analytics.profitFactor.toFixed(2)
            }
            trend={analytics.profitFactor >= 1 ? "positive" : "negative"}
          />
          <MetricCard
            label="Risk Score"
            value={`${Math.round(analytics.riskScore)}/100`}
            trend={analytics.riskScore >= 60 ? "positive" : "negative"}
          />
          <MetricCard
            label="Discipline"
            value={`${Math.round(analytics.disciplineScore)}/100`}
            trend={analytics.disciplineScore >= 60 ? "positive" : "negative"}
          />
          <MetricCard
            label="Max Drawdown"
            value={`-${analytics.maxDrawdown.toFixed(1)}%`}
            trend="negative"
          />
        </div>
      </div>

      {/* ── Row 3: Composite score cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScoreCard label="Performance Score" score={analytics.performanceScore} />
        <ScoreCard label="Risk Score" score={analytics.riskScore} />
        <ScoreCard label="Behaviour Score" score={analytics.behaviourScore} />
      </div>

      {/* ── Row 4: Performance metrics ────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionHeading>Performance</SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            label="Winning Trades"
            value={analytics.winningTrades}
            trend="positive"
          />
          <MetricCard
            label="Losing Trades"
            value={analytics.losingTrades}
            trend="negative"
          />
          <MetricCard
            label="Avg Win"
            value={formatCurrency(analytics.averageWinningTrade)}
            trend="positive"
          />
          <MetricCard
            label="Avg Loss"
            value={formatCurrency(analytics.averageLosingTrade)}
            trend="negative"
          />
          <MetricCard
            label="Risk/Reward"
            value={analytics.riskRewardRatio.toFixed(2)}
            trend={analytics.riskRewardRatio >= 1 ? "positive" : "neutral"}
          />
          <MetricCard
            label="Expectancy"
            value={formatCurrency(analytics.expectancy)}
            trend={analytics.expectancy >= 0 ? "positive" : "negative"}
          />
          <MetricCard
            label="Best Streak"
            value={`${analytics.largestWinningStreak} wins`}
            trend="positive"
          />
          <MetricCard
            label="Worst Streak"
            value={`${analytics.largestLosingStreak} losses`}
            trend="negative"
          />
        </div>
      </div>

      {/* ── Row 5: Charts — equity curve + daily PnL ──────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EquityCurveChart data={analytics.equityCurve} />
        <DailyPnLChart data={analytics.dailyPnL} />
      </div>

      {/* ── Row 6: Risk metrics ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionHeading>Risk</SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Sharpe Ratio"
            value={analytics.sharpeRatio.toFixed(2)}
            trend={analytics.sharpeRatio >= 1 ? "positive" : "negative"}
          />
          <MetricCard
            label="Calmar Ratio"
            value={analytics.calmarRatio.toFixed(2)}
            trend={analytics.calmarRatio >= 1 ? "positive" : "negative"}
          />
          <MetricCard
            label="Avg Position"
            value={formatCurrency(analytics.averagePositionSize)}
          />
          <MetricCard
            label="Portfolio Exposure"
            value={formatPercent(analytics.portfolioExposure)}
          />
          <MetricCard
            label="Pos. Concentration"
            value={analytics.positionConcentration.toFixed(0)}
            subValue="HHI score"
          />
          <MetricCard
            label="Sector Conc."
            value={
              analytics.sectorConcentration > 0
                ? formatPercent(analytics.sectorConcentration)
                : "N/A"
            }
          />
        </div>
      </div>

      {/* ── Row 7: Sector + Win/Loss charts ──────────────────────────────── */}
      {hasSectors ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectorPieChart data={analytics.sectorExposure} />
          <WinLossChart
            winningTrades={analytics.winningTrades}
            losingTrades={analytics.losingTrades}
          />
        </div>
      ) : (
        <WinLossChart
          winningTrades={analytics.winningTrades}
          losingTrades={analytics.losingTrades}
        />
      )}

      {/* ── Row 8: Behaviour scores ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <SectionHeading>Behaviour</SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard
            label="Overtrading Score"
            score={analytics.overtradingScore}
            description="How often you exceed optimal trade frequency"
          />
          <ScoreCard
            label="Discipline Score"
            score={analytics.disciplineScore}
            description="How consistently you follow your risk rules"
          />
          <ScoreCard
            label="Emotional Score"
            score={analytics.emotionalScore}
            description="How much losses affect your next trade"
          />
          <ScoreCard
            label="Consistency Score"
            score={analytics.consistencyScore}
            description="How smooth and predictable your returns are"
          />
        </div>
      </div>

      {/* ── Row 9: AI Insights ────────────────────────────────────────────── */}
      {analytics.insights.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionHeading>AI Insights</SectionHeading>
          <div className="flex flex-col gap-3">
            {analytics.insights.map((insight, i) => (
              <InsightCard key={i} type={insight.type} message={insight.message} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
