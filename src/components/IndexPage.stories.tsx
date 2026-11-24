import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, userEvent, within } from "storybook/test";
import { IndexPage } from "./IndexPage";

const meta = {
  component: IndexPage,
} satisfies Meta<typeof IndexPage>;

export default meta;

// A play function changes the page address; put it back so the next story starts clean.
const restoreAddress = () => {
  const original = window.location.href;
  return () => window.history.replaceState(null, "", original);
};
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

const address = () => {
  const params = new URLSearchParams(window.location.search);
  return { order: params.get("order") ?? undefined, tag: params.get("tag") ?? undefined };
};

const titles = (canvas: ReturnType<typeof within>) =>
  (canvas.getAllByRole("listitem") as HTMLElement[]).map(
    (item) => item.querySelector("a")!.textContent,
  );

export const Catalogue: Story = {
  args: {
    recipes: [
      {
        slug: "pudim",
        title: "Pudim",
        rating: 5,
        totalMinutes: 240,
        timesMade: 4,
        lastMade: "2026-05-01",
        tags: ["sobremesa"],
      },
      {
        slug: "arroz-doce",
        title: "Arroz doce",
        totalMinutes: 45,
        timesMade: 0,
        tags: ["sobremesa"],
      },
      {
        slug: "pao-de-queijo",
        title: "Pão de queijo",
        rating: 3,
        timesMade: 1,
        lastMade: "2025-12-24",
        tags: ["salgado"],
      },
      {
        slug: "carbonara",
        title: "Carbonara picante",
        rating: 4,
        totalMinutes: 30,
        timesMade: 7,
        lastMade: "2026-03-10",
        tags: ["massa", "salgado"],
      },
      { slug: "panqueca", title: "Panqueca", timesMade: 0 },
      {
        slug: "abobora",
        title: "Abóbora assada",
        rating: 2,
        totalMinutes: 60,
        timesMade: 1,
        lastMade: "2026-01-15",
      },
    ],
  },
  beforeEach: restoreAddress,
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

export const SortedByRating: Story = {
  ...Catalogue,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "Nota" }));
    await expect(canvas.getByRole("link", { name: "Nota" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(canvas.queryByRole("navigation", { name: "Letras" })).toBeNull();
    await expect(canvas.queryByRole("region")).toBeNull();
    await expect(titles(canvas)).toEqual([
      expect.stringContaining("Pudim"),
      expect.stringContaining("Carbonara picante"),
      expect.stringContaining("Pão de queijo"),
      expect.stringContaining("Abóbora assada"),
      expect.stringContaining("Arroz doce"),
      expect.stringContaining("Panqueca"),
    ]);
    await expect(address()).toEqual({ order: "rating" });
  },
};

export const FilteredByTag: Story = {
  ...Catalogue,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "salgado" }));
    await expect(canvas.getByText("Receitas · 2")).toBeVisible();
    await expect(address()).toEqual({ tag: "salgado" });

    await userEvent.click(canvas.getByRole("link", { name: "Mais feitas" }));
    await expect(titles(canvas)).toEqual([
      expect.stringContaining("Carbonara picante"),
      expect.stringContaining("Pão de queijo"),
    ]);
    await expect(address()).toEqual({ order: "times-made", tag: "salgado" });

    await userEvent.click(canvas.getByRole("link", { name: "Limpar filtro" }));
    await expect(canvas.getByText("Receitas · 6")).toBeVisible();
    await expect(canvas.queryByRole("link", { name: "Limpar filtro" })).toBeNull();

    await userEvent.click(canvas.getByRole("link", { name: "sobremesa" }));
    await expect(canvas.getByText("Receitas · 2")).toBeVisible();
  },
};
