"use client";

import { PersonalityBadge } from "./PersonalityBadge";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ringColor(score: number): string {
  if (score >= 75) return "#6366F1";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

interface ScoreRingProps {
  score: number;
  grade: string;
  personality?: string;
}

export function ScoreRing({ score, grade, personality }: ScoreRingProps) {
  const rounded = Math.round(score);
  const color = ringColor(rounded);
  const offset = CIRCUMFERENCE * (1 - rounded / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 120 120"
        width={168}
        height={168}
        aria-label={`Master Score: ${rounded}`}
      >
        {/* Track */}
        <circle
          cx={60}
          cy={60}
          r={RADIUS}
          fill="none"
          stroke="#1E1E2E"
          strokeWidth={8}
        />
        {/* Progress arc */}
        <circle
          cx={60}
          cy={60}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
        {/* Score number */}
        <text
          x={60}
          y={55}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#F1F5F9"
          fontSize={26}
          fontWeight="bold"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {rounded}
        </text>
        {/* /100 label */}
        <text
          x={60}
          y={74}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={10}
        >
          /100
        </text>
      </svg>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-base font-semibold" style={{ color }}>
          {grade}
        </span>
        <span className="text-xs" style={{ color: "#475569" }}>
          Master Trader Score
        </span>
        {personality && <PersonalityBadge personality={personality} />}
      </div>
    </div>
  );
}
