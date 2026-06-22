"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  type TooltipProps,
} from "recharts";
import type { EquityCurvePoint } from "@/types";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        backgroundColor: "#111118",
        border: "1px solid #1E1E2E",
        color: "#94A3B8",
      }}
    >
      <p>{label}</p>
      <p className="font-semibold tabular-nums" style={{ color: "#6366F1" }}>
        {INR.format(payload[0].value ?? 0)}
      </p>
    </div>
  );
}

function fmtDate(v: string): string {
  return new Date(v).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function fmtY(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
  return `₹${v}`;
}

interface Props {
  data: EquityCurvePoint[];
}

export function EquityCurveChart({ data }: Props) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="mb-4 text-sm" style={{ color: "#94A3B8" }}>
        Equity Curve
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={fmtY}
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
