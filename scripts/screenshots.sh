#!/bin/sh
# Runs the screenshot tests in the official Playwright image, as linux/amd64 to match CI.
# Pass --update-snapshots to regenerate the references.
# On Apple silicon the Docker host needs Rosetta for amd64 Chromium (e.g. `colima start -p cilinux-fast`).
set -eu

version=$(node -p 'require("./package.json").devDependencies["@playwright/test"]')
pnpm_version=$(pnpm --version)

exec docker run --rm --platform linux/amd64 --ipc=host --init \
  -v "$PWD":/work \
  -v recipe-app-node-modules-amd64:/work/node_modules \
  -v recipe-app-pnpm-store-amd64:/pnpm-store \
  -w /work \
  -e CI="${CI:-}" \
  "mcr.microsoft.com/playwright:v$version-noble" \
  sh -c "npx -y pnpm@$pnpm_version install --frozen-lockfile --store-dir /pnpm-store && npx -y pnpm@$pnpm_version screenshots:run $*"
