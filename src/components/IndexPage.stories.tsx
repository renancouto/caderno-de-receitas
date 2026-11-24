import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, within } from "storybook/test";
import { IndexPage } from "./IndexPage";

const meta = {
  component: IndexPage,
} satisfies Meta<typeof IndexPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneRecipe: Story = {
  args: {
    recipes: [
      {
        slug: "carbonara-picante",
        title: "Carbonara picante",
        rating: 4,
        totalMinutes: 30,
        timesMade: 2,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Caderno de receitas")).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Índice");
    await expect(canvas.getByText("Receitas · 1")).toBeVisible();
    await expect(canvas.getByRole("link", { name: /Carbonara picante/ })).toHaveAttribute(
      "href",
      "/recipes/carbonara-picante",
    );
  },
};

export const Catalogue: Story = {
  args: {
    recipes: [
      { slug: "pudim", title: "Pudim", rating: 5, totalMinutes: 240, timesMade: 4 },
      { slug: "arroz-doce", title: "Arroz doce", totalMinutes: 45, timesMade: 0 },
      { slug: "pao-de-queijo", title: "Pão de queijo", rating: 3, timesMade: 1 },
      { slug: "carbonara", title: "Carbonara picante", rating: 4, totalMinutes: 30, timesMade: 7 },
      { slug: "panqueca", title: "Panqueca", timesMade: 0 },
      { slug: "abobora", title: "Abóbora assada", rating: 2, totalMinutes: 60, timesMade: 1 },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Receitas · 6")).toBeVisible();
    const letters = within(canvas.getByRole("navigation", { name: "Letras" }));
    await expect(letters.getAllByRole("link").map((link) => link.textContent)).toEqual([
      "A",
      "C",
      "P",
    ]);
    await expect(letters.getByRole("link", { name: "P" })).toHaveAttribute("href", "#letter-P");
    const groupP = within(canvas.getByRole("region", { name: "P" }));
    await expect(
      groupP.getAllByRole("listitem").map((item) => item.querySelector("a")!.textContent),
    ).toEqual([
      expect.stringContaining("Panqueca"),
      expect.stringContaining("Pão de queijo"),
      expect.stringContaining("Pudim"),
    ]);
  },
};
