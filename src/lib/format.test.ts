import { describe, expect, test } from "vitest";
import {
  formatDate,
  formatMinutes,
  formatQuantity,
  formatNumber,
  formatTimesMade,
  sourceName,
} from "./format";

describe("formatQuantity", () => {
  test.each([
    [{ name: "Espaguete", quantity: 200, unit: "g" as const }, "200 g"],
    [{ name: "Caldo", quantity: 1.5, unit: "l" as const }, "1,5 L"],
    [{ name: "Leite", quantity: 300, unit: "ml" as const }, "300 ml"],
    [{ name: "Farinha", quantity: 1, unit: "cup" as const }, "1 xíc."],
    [{ name: "Farinha", quantity: 0.5, unit: "cup" as const }, "0,5 xíc."],
    [{ name: "Farinha", quantity: 2.5, unit: "cup" as const }, "2,5 xíc."],
    [{ name: "Ovos", quantity: 2 }, "2"],
    [{ name: "Sal", toTaste: true as const }, "a gosto"],
  ])("%o reads %s", (ingredient, expected) => {
    expect(formatQuantity(ingredient)).toBe(expected);
  });
});

test.each([
  [20, "20 min"],
  [60, "1 h"],
  [95, "1 h 35 min"],
])("formatMinutes(%i) is %s", (minutes, expected) => {
  expect(formatMinutes(minutes)).toBe(expected);
});

test.each([
  [0, "0"],
  [12, "12"],
  [1.5, "1,5"],
])("formatNumber(%d) is %s, with no unit word", (value, expected) => {
  expect(formatNumber(value)).toBe(expected);
});

test("formatDate writes the day, a short Portuguese month and the year", () => {
  expect(formatDate("2026-03-02")).toBe("2 mar. 2026");
  expect(formatDate("2025-12-31")).toBe("31 dez. 2025");
});

test("sourceName is the host without www", () => {
  expect(sourceName("https://www.youtube.com/watch?v=x")).toBe("youtube.com");
  expect(sourceName("https://panelinha.com.br/receita/x")).toBe("panelinha.com.br");
});

test.each([
  [0, "Nunca feita"],
  [1, "1×"],
  [12, "12×"],
])("made %i times reads %s", (times, expected) => {
  expect(formatTimesMade(times)).toBe(expected);
});
