import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, userEvent, within } from "storybook/test";
import { StepList } from "./StepList";

const meta = {
  component: StepList,
  args: { steps: ["Cozinhe a massa.", "Misture com os ovos.", "Sirva."] },
  decorators: [
    (Story) => (
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ticked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = await canvas.findByRole("button", { name: "Cozinhe a massa." });
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(first);
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("button", { name: "Sirva." })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    const second = canvas.getByRole("button", { name: "Misture com os ovos." });
    await userEvent.click(second);
    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(second);
    await expect(second).toHaveAttribute("aria-pressed", "true");
  },
};
