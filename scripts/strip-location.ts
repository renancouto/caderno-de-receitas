import { readFile, writeFile } from "node:fs/promises";
import { stripLocationMetadata } from "../src/lib/photo-location.ts";

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error("Usage: pnpm strip:location <photo>...");
  process.exit(2);
}

for (const path of paths) {
  await writeFile(path, await stripLocationMetadata(await readFile(path)));
  console.log(`${path}: location metadata removed`);
}
