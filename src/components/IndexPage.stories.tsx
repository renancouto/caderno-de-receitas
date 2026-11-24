import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { IndexPage } from "./IndexPage";

const meta = {
  title: "Pages/Índice",
  id: "pages-index",
  component: IndexPage,
} satisfies Meta<typeof IndexPage>;

export default meta;

// A play function changes the page address; put it back so the next story starts clean.
const restoreAddress = () => {
  const original = window.location.href;
  return () => window.history.replaceState(null, "", original);
};
type Story = StoryObj<typeof meta>;

const address = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    order: params.get("order") ?? undefined,
    tag: params.get("tag") ?? undefined,
    q: params.get("q") ?? undefined,
  };
};

const expectCount = (canvas: ReturnType<typeof within>, count: number) =>
  waitFor(() => expect(canvas.getByText(/^Índice/)).toHaveTextContent(`Índice · ${count}`));

// The page updates after the click or the stubbed search resolves, so wait for the list.
const expectTitles = (canvas: ReturnType<typeof within>, expected: string[]) =>
  waitFor(() =>
    expect(titles(canvas)).toEqual(expected.map((title) => expect.stringContaining(title))),
  );

const titles = (canvas: ReturnType<typeof within>) =>
  (canvas.getAllByRole("listitem") as HTMLElement[]).map(
    (item) => item.querySelector("a")!.textContent,
  );

export const Default: Story = {
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
    await expectCount(canvas, 6);
    await expectTitles(canvas, [
      "Abóbora assada",
      "Arroz doce",
      "Carbonara picante",
      "Panqueca",
      "Pão de queijo",
      "Pudim",
    ]);
    await expect(canvas.queryByRole("navigation", { name: "Letras" })).toBeNull();
    await expect(canvas.queryByRole("link", { name: "Limpar" })).toBeNull();
  },
};

export const Sorted: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "Nota" }));
    await expect(canvas.getByRole("link", { name: "Nota" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(canvas.getByRole("link", { name: "Limpar" })).toBeVisible();
    await expectTitles(canvas, [
      "Pudim",
      "Carbonara picante",
      "Pão de queijo",
      "Abóbora assada",
      "Arroz doce",
      "Panqueca",
    ]);
    await expect(address()).toEqual({ order: "rating" });
  },
};

export const FilteredByTag: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "salgado" }));
    await expectCount(canvas, 2);
    await expect(address()).toEqual({ tag: "salgado" });

    await userEvent.click(canvas.getByRole("link", { name: "Mais feitas" }));
    await expectTitles(canvas, ["Carbonara picante", "Pão de queijo"]);
    await expect(address()).toEqual({ order: "times-made", tag: "salgado" });

    await userEvent.click(canvas.getByRole("link", { name: "Limpar" }));
    await expectCount(canvas, 6);
    await expect(canvas.queryByRole("link", { name: "Limpar" })).toBeNull();

    await userEvent.click(canvas.getByRole("link", { name: "sobremesa" }));
    await expectCount(canvas, 2);
  },
};

// Stands in for Pagefind at the component boundary: matches on the title.
const stubSearch = async (query: string) =>
  new Set(
    (Default.args!.recipes ?? [])
      .filter((recipe) => recipe.title.toLowerCase().includes(query.toLowerCase()))
      .map((recipe) => recipe.slug),
  );

export const Searching: Story = {
  ...Default,
  args: { ...Default.args!, search: stubSearch },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("searchbox", { name: "Buscar receitas" });
    await userEvent.type(field, "an");
    await expectCount(canvas, 2);
    await expect(address()).toEqual({ q: "an" });

    await userEvent.click(canvas.getByRole("link", { name: "Nota" }));
    await expectTitles(canvas, ["Carbonara picante", "Panqueca"]);
    await expect(address()).toEqual({ order: "rating", q: "an" });

    await userEvent.click(canvas.getByRole("link", { name: "salgado" }));
    await expectTitles(canvas, ["Carbonara picante"]);

    // Clearing the text leaves the order and the Tag: both salgado Recipes, best rated first.
    await userEvent.clear(field);
    await expectTitles(canvas, ["Carbonara picante", "Pão de queijo"]);
    await expectCount(canvas, 2);
    await expect(address()).toEqual({ order: "rating", tag: "salgado" });
  },
};

export const NoResults: Story = {
  ...Searching,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox", { name: "Buscar receitas" }), "xyz");
    await expect(await canvas.findByText("Nenhuma receita encontrada.")).toBeVisible();
    await expectCount(canvas, 0);
  },
};
