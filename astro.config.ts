import preact from "@astrojs/preact";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [preact()],
  site: "https://renancouto.github.io",
  base: "/caderno-de-receitas",
  outDir: process.env.OUT_DIR ?? "dist",
});
