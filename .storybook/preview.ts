import "../src/styles/base.css";
import type { Preview } from "@storybook/preact-vite";

const preview: Preview = {
  parameters: {
    // Render stories edge to edge, like the site; the page layout sets its own spacing.
    layout: "fullscreen",
    // Fail component tests on any accessibility violation.
    a11y: { test: "error" },
  },
};

export default preview;
