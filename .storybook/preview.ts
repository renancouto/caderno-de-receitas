import type { Preview } from "@storybook/preact-vite";

const preview: Preview = {
  parameters: {
    // Fail component tests on any accessibility violation.
    a11y: { test: "error" },
  },
};

export default preview;
