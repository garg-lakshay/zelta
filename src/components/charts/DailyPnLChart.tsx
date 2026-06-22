"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  type TooltipProps,
} from "recharts";
import type { DailyPnLPoint } from "@/types";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;
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
      <p
        className="font-semibold tabular-nums"
        style={{ color: val >= 0 ? "#22C55E" : "#EF4444" }}
      >
        {INR.format(val)}
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
  if (abs >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
  return `₹${v}`;
}

interface Props {
  data: DailyPnLPoint[];
}

export function DailyPnLChart({ data }: Props) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="mb-4 text-sm" style={{ color: "#94A3B8" }}>
        Daily P&amp;L
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
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
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.pnl >= 0 ? "#22C55E" : "#EF4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
