import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildInput, buildInstructions } from "./instructions";

const rules = readFileSync("docs/recipe-rules.md", "utf8");

describe("buildInstructions", () => {
  const instructions = buildInstructions({
    rules,
    today: "2026-11-26",
    existingFiles: ["carbonara-picante.md"],
  });

  it("sends the whole rules document", () => {
    expect(instructions).toContain(rules.trim());
  });

  it("gives today's date and the names already taken", () => {
    expect(instructions).toContain("2026-11-26");
    expect(instructions).toContain("carbonara-picante.md");
  });
});

describe("buildInput", () => {
  it("sends the Request's text and its Sources", () => {
    const input = buildInput({ text: "Bolo\n3 ovos", links: ["https://example.com/bolo"] });
    expect(input).toContain("Bolo\n3 ovos");
    expect(input).toContain("- https://example.com/bolo");
  });

  it("says when there are no Sources", () => {
    expect(buildInput({ text: "Bolo", links: [] })).toContain("Sources: none");
  });
});
