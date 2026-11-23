import { describe, expect, test } from "vitest";
import { cookStats, newestFirst } from "./cook-log";

describe("cookStats", () => {
  test("a Recipe with no Log was never made", () => {
    expect(cookStats(undefined)).toEqual({ timesMade: 0 });
    expect(cookStats([])).toEqual({ timesMade: 0 });
  });

  test("times made is the number of Cooks and last made the newest date", () => {
    const log = [
      { date: "2026-03-02" },
      { date: "2026-11-01", note: "ok" },
      { date: "2025-12-24" },
    ];
    expect(cookStats(log)).toEqual({ timesMade: 3, lastMade: "2026-11-01" });
  });
});

describe("newestFirst", () => {
  test("orders Cooks newest first without changing the Log", () => {
    const log = [{ date: "2025-01-05" }, { date: "2026-02-01" }, { date: "2025-07-10" }];
    expect(newestFirst(log).map((cook) => cook.date)).toEqual([
      "2026-02-01",
      "2025-07-10",
      "2025-01-05",
    ]);
    expect(log[0]?.date).toBe("2025-01-05");
  });
});
