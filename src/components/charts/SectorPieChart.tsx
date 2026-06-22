"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { SectorExposurePoint } from "@/types";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

interface Props {
  data: SectorExposurePoint[];
}

export function SectorPieChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
    >
      <p className="mb-4 text-sm" style={{ color: "#94A3B8" }}>
        Sector Exposure
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="sector"
            cx="50%"
            cy="45%"
            outerRadius={80}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => [
              `${Number(val).toFixed(1)}%`,
              "Allocation",
            ]}
            contentStyle={{
              backgroundColor: "#111118",
              border: "1px solid #1E1E2E",
              borderRadius: "8px",
              color: "#F1F5F9",
              fontSize: "12px",
            }}
          />
          <Legend
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
