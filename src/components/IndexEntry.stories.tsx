import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, within } from "storybook/test";
import { IndexEntry } from "./IndexEntry";

const meta = {
  component: IndexEntry,
  decorators: [
    (Story) => (
      <div class="page">
        <ul class="plain-list">
          <Story />
        </ul>
      </div>
    ),
  ],
} satisfies Meta<typeof IndexEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rated: Story = {
  args: {
    recipe: {
      slug: "carbonara-picante",
      title: "Carbonara picante",
      rating: 4,
      totalMinutes: 30,
      timesMade: 3,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: /Carbonara picante/ })).toHaveAttribute(
      "href",
      "/recipes/carbonara-picante",
    );
    await expect(canvas.getByRole("link", { name: /Nota 4 de 5/ })).toHaveTextContent("4/5");
    await expect(canvas.getByText("30 min · Feita · 3")).toBeVisible();
  },
};

export const NotRated: Story = {
  args: { recipe: { slug: "pao", title: "Pão de queijo", totalMinutes: 90, timesMade: 1 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: /Sem nota/ })).toHaveTextContent("–/5");
    await expect(canvas.getByText("1 h 30 min · Feita · 1")).toBeVisible();
  },
};

export const NeverMadeWithoutTime: Story = {
  args: { recipe: { slug: "pudim", title: "Pudim", timesMade: 0 } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Nunca feita")).toBeVisible();
  },
};

export const LongTitle: Story = {
  args: {
    recipe: {
      slug: "longa",
      title: "Torta de limão com merengue italiano e base de biscoito amanteigado",
      rating: 5,
      totalMinutes: 150,
      timesMade: 12,
    },
  },
};
