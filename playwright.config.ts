import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4322/minhas-receitas/";

// Screenshot tests only run inside the official Playwright image (see scripts/screenshots.sh),
// so reference screenshots always come from Linux and match CI.
const screenshots = process.env.SCREENSHOTS === "1";

const site = {
  // `--ignore-lock` keeps the server in the foreground: when Astro detects a coding
  // agent it otherwise starts a background server and exits, which Playwright treats
  // as a crash and which leaves the server running.
  command: "astro preview --port 4322 --ignore-lock",
  env: { OUT_DIR: "dist-e2e" },
  url: baseURL,
  reuseExistingServer: false,
};

const storybook = {
  command: "vite preview --outDir storybook-static --port 6007 --strictPort",
  url: "http://localhost:6007",
  reuseExistingServer: false,
};

export default defineConfig({
  use: { baseURL },
  snapshotPathTemplate: "tests/screenshots/references/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixels: 0, threshold: 0 } },
  projects: screenshots
    ? [{ name: "screenshots", testDir: "tests/screenshots", use: { ...devices["Pixel 7"] } }]
    : [{ name: "e2e", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"] } }],
  webServer: screenshots ? [site, storybook] : site,
});
