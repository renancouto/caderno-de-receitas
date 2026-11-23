import { checkRecipeFile } from "../src/lib/check-recipe-file.ts";

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error("Usage: pnpm check:recipe <recipe-file>...");
  process.exit(2);
}

const results = paths.map(checkRecipeFile);
for (const { message } of results) console.log(message);
process.exit(results.every((r) => r.ok) ? 0 : 1);
