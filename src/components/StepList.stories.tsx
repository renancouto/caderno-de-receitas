import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import type { ResponsivePhoto } from "../lib/responsive-photo";
import { StepList, type StepView } from "./StepList";

const photo = (n: number): ResponsivePhoto => ({
  src: new URL(`./fixtures/passo-${n}.jpg`, import.meta.url).href,
  width: 800,
  height: 600,
  sources: [],
});

const texts = ["Cozinhe a massa.", "Misture com os ovos.", "Sirva."];
const withPhotos = (...indexes: number[]): StepView[] =>
  texts.map((text, i) => (indexes.includes(i) ? { text, photo: photo(i + 1) } : { text }));

const meta = {
  component: StepList,
  args: { steps: withPhotos() },
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

const stepPhotos = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLImageElement>(".step-photo"),
];

const photosLoad = (canvasElement: HTMLElement) =>
  waitFor(() =>
    expect(stepPhotos(canvasElement).every((image) => image.naturalWidth > 0)).toBe(true),
  );

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(stepPhotos(canvasElement)).toHaveLength(0);
  },
};

export const SomePhotos: Story = {
  args: { steps: withPhotos(1) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const step = await canvas.findByRole("button", { name: "Misture com os ovos." });
    const [image] = stepPhotos(canvasElement);
    await expect(stepPhotos(canvasElement)).toHaveLength(1);
    await expect(step).toContainElement(image!);
    await expect(image!.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      within(step).getByText("Misture com os ovos.").getBoundingClientRect().top,
    );
    await photosLoad(canvasElement);
  },
};

export const AllPhotos: Story = {
  args: { steps: withPhotos(0, 1, 2) },
  play: async ({ canvasElement }) => {
    await expect(stepPhotos(canvasElement)).toHaveLength(3);
    await photosLoad(canvasElement);
  },
};

export const Ticked: Story = {
  args: { steps: withPhotos(0, 2) },
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
    await photosLoad(canvasElement);
  },
};
