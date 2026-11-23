import type { Cook } from "./recipe-rules";

export type CookStats = { timesMade: number; lastMade?: string };

export function newestFirst(log: readonly Cook[]): Cook[] {
  return [...log].sort((a, b) => b.date.localeCompare(a.date));
}

export function cookStats(log: readonly Cook[] | undefined): CookStats {
  if (!log || log.length === 0) return { timesMade: 0 };
  return { timesMade: log.length, lastMade: newestFirst(log)[0]!.date };
}
