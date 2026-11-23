import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, within } from "storybook/test";
import { IndexPage } from "./IndexPage";

const meta = {
  component: IndexPage,
} satisfies Meta<typeof IndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneRecipe: Story = {
  args: { recipes: [{ slug: "carbonara-picante", title: "Carbonara picante" }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Carbonara picante" })).toHaveAttribute(
      "href",
      "/recipes/carbonara-picante",
    );
  },
};
