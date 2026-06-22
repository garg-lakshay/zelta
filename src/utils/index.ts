export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function minutesToDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getGrade(score: number): string {
  if (score >= 90) return "Elite Trader";
  if (score >= 75) return "Advanced Trader";
  if (score >= 60) return "Developing Trader";
  if (score >= 40) return "Inconsistent Trader";
  return "High Risk Trader";
}
