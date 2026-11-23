import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, userEvent, within } from "storybook/test";
import { IngredientList } from "./IngredientList";

const meta = {
  component: IngredientList,
  args: {
    groups: [
      {
        name: "Massa",
        items: [
          { name: "Cenoura", quantity: 300, unit: "g" },
          { name: "Ovos", quantity: 3 },
        ],
      },
      { name: "Cobertura", items: [{ name: "Sal", toTaste: true }] },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IngredientList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ticked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cenoura = await canvas.findByRole("button", { name: /Cenoura/ });
    await expect(cenoura).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(cenoura);
    await expect(cenoura).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: /Sal/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    const ovos = canvas.getByRole("button", { name: /Ovos/ });
    await userEvent.click(ovos);
    await userEvent.click(ovos);
    await expect(ovos).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(ovos);
    await expect(ovos).toHaveAttribute("aria-pressed", "true");
  },
};
