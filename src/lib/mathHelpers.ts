/**
 * Arithmetic mean of a number array.
 * Returns 0 for empty arrays.
 */
export function mean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Population standard deviation.
 * Returns 0 for empty arrays.
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = mean(numbers);
  const squaredDiffs = numbers.map((n) => Math.pow(n - avg, 2));
  return Math.sqrt(mean(squaredDiffs));
}

/**
 * Clamps a value between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Returns unique date strings ("YYYY-MM-DD") from an array of Date objects.
 */
export function getUniqueDates(dates: Date[]): string[] {
  const dateStrings = dates.map((d) => d.toISOString().split("T")[0]);
  return [...new Set(dateStrings)];
}

/**
 * Absolute difference in minutes between two dates.
 */
export function minutesBetween(start: Date, end: Date): number {
  return Math.abs(end.getTime() - start.getTime()) / (1000 * 60);
}
