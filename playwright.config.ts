import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:4322" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // `--ignore-lock` keeps the server in the foreground: when Astro detects a coding
    // agent it otherwise starts a background server and exits, which Playwright treats
    // as a crash and which leaves the server running.
    command: "astro preview --port 4322 --ignore-lock",
    env: { OUT_DIR: "dist-e2e" },
    url: "http://localhost:4322",
    reuseExistingServer: false,
  },
});
