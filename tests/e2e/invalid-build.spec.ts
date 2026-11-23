import { execFile } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";

test("building with an invalid Recipe fails and names the file and problems", async () => {
  // The build fails, so its output folder goes to a temp folder rather than the repo.
  const outDir = await mkdtemp(join(tmpdir(), "invalid-build-"));
  const result = await promisify(execFile)("pnpm", ["exec", "astro", "build"], {
    env: { ...process.env, RECIPES_DIR: "tests/e2e/invalid-recipes", OUT_DIR: outDir },
  }).then(
    () => ({ failed: false, output: "" }),
    (error: { stdout?: string; stderr?: string }) => ({
      failed: true,
      output: `${error.stdout ?? ""}${error.stderr ?? ""}`,
    }),
  );

  expect(result.failed).toBe(true);
  expect(result.output).toContain("Bad_Name.md");
  expect(result.output).toContain("rating must be a whole number from 1 to 5");
  expect(result.output).toContain("tbsp");
});
