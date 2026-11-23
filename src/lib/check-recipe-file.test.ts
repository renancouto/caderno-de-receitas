import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkRecipeFile } from "./check-recipe-file";

const recipe = (extra = "") => `---
title: Bolo
ingredients:
  - items:
      - name: Farinha
        quantity: 200
        unit: g
${extra}---

## Preparo

1. Asse.
`;

const write = (fileName: string, contents: string) => {
  const path = join(mkdtempSync(join(tmpdir(), "check-recipe-")), fileName);
  writeFileSync(path, contents);
  return path;
};

describe("checkRecipeFile", () => {
  it("accepts a valid Recipe file", () => {
    expect(checkRecipeFile(write("bolo.md", recipe()))).toMatchObject({ ok: true });
  });

  it("lists every problem under the file path", () => {
    const path = write("Bolo.md", recipe("rating: 6\n"));
    const result = checkRecipeFile(path);
    expect(result.ok).toBe(false);
    expect(result.message).toContain(path);
    expect(result.message).toContain("lowercase kebab-case");
    expect(result.message).toContain("rating must be a whole number from 1 to 5");
  });
});
