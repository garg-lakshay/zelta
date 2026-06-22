interface PersonalityBadgeProps {
  personality: string;
}

function badgeColors(p: string): { bg: string; text: string } {
  if (p.includes("Disciplined"))
    return { bg: "rgba(99,102,241,0.20)", text: "#818CF8" };
  if (p.includes("Conservative"))
    return { bg: "rgba(34,197,94,0.20)", text: "#4ADE80" };
  if (p.includes("Aggressive"))
    return { bg: "rgba(239,68,68,0.20)", text: "#F87171" };
  if (p.includes("Momentum"))
    return { bg: "rgba(245,158,11,0.20)", text: "#FCD34D" };
  return { bg: "rgba(100,116,139,0.20)", text: "#94A3B8" };
}

export function PersonalityBadge({ personality }: PersonalityBadgeProps) {
  const { bg, text } = badgeColors(personality);
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {personality}
    </span>
  );
}
