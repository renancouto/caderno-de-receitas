import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, within } from "storybook/test";
import { RecipePage } from "./RecipePage";

const meta = {
  component: RecipePage,
} satisfies Meta<typeof RecipePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recipe: {
      title: "Carbonara picante",
      ingredients: [
        {
          items: [
            { name: "Espaguete", quantity: 200, unit: "g" },
            { name: "Ovos", quantity: 2 },
            { name: "Pimenta-do-reino", toTaste: true },
          ],
        },
      ],
      steps: ["Cozinhe a massa.", "Misture com os ovos."],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Carbonara picante");
    const ingredients = within(canvas.getByRole("region", { name: "Ingredientes" }));
    await expect(ingredients.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Espaguete200 g",
      "Ovos2",
      "Pimenta-do-reinoa gosto",
    ]);
    const steps = within(canvas.getByRole("region", { name: "Preparo" }));
    await expect(steps.getAllByRole("listitem")).toHaveLength(2);
    await expect(canvas.getByRole("link", { name: /Todas as receitas/ })).toHaveAttribute(
      "href",
      "/",
    );
  },
};
