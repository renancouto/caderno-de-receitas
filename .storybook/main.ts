import type { StorybookConfig } from "@storybook/preact-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-vitest", "@storybook/addon-a11y"],
  framework: "@storybook/preact-vite",
};

export default config;
