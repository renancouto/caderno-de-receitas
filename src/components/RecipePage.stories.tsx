import type { Meta, StoryObj } from "@storybook/preact-vite";
import { expect, waitFor, within } from "storybook/test";
import type { Recipe } from "../lib/recipe-rules";
import type { ResponsivePhoto } from "../lib/responsive-photo";
import { RecipePage } from "./RecipePage";

const meta = {
  title: "Pages/Receita",
  id: "pages-recipe",
  component: RecipePage,
} satisfies Meta<typeof RecipePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const minimal: Recipe = {
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
};

const complete: Recipe = {
  title: "Bolo de cenoura com cobertura",
  sources: ["https://www.youtube.com/watch?v=abc", "https://panelinha.com.br/receita/bolo"],
  servings: 12,
  totalMinutes: 75,
  tags: ["sobremesa", "café da tarde"],
  rating: 4,
  ingredients: [
    {
      name: "Massa",
      items: [
        { name: "Cenoura", quantity: 300, unit: "g" },
        { name: "Óleo", quantity: 0.5, unit: "cup" },
        { name: "Farinha de trigo", quantity: 2.5, unit: "cup" },
        { name: "Ovos", quantity: 3 },
      ],
    },
    {
      name: "Cobertura",
      items: [
        { name: "Leite", quantity: 1.5, unit: "l" },
        { name: "Chocolate em pó", quantity: 1, unit: "cup" },
        { name: "Sal", toTaste: true },
      ],
    },
  ],
  steps: [
    "Bata a cenoura, o óleo e os ovos no liquidificador.",
    "Misture a farinha e asse por 40 minutos.",
    "Ferva a cobertura e espalhe sobre o bolo ainda quente.",
  ],
  notes: "Uso menos açúcar que a receita original.\n\nFica melhor no dia seguinte.",
  log: [
    { date: "2025-12-24", note: "Fiz para o Natal." },
    { date: "2026-11-01" },
    { date: "2026-03-02", note: "Cobertura ficou rala; ferver mais." },
  ],
};

const photo: ResponsivePhoto = {
  src: new URL("./fixtures/header.jpg", import.meta.url).href,
  width: 1600,
  height: 900,
  sources: [],
};

const region = (canvasElement: HTMLElement, name: string) =>
  within(within(canvasElement).getByRole("region", { name }));

const facts = (canvasElement: HTMLElement) =>
  Object.fromEntries(
    [...canvasElement.querySelectorAll(".fact")].map((fact) => [
      fact.querySelector("dt")!.textContent,
      fact.querySelector("dd")!.textContent,
    ]),
  );

export const Complete: Story = {
  args: { recipe: complete },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(complete.title);
    await expect(canvas.getByRole("list", { name: "Tags" })).toHaveTextContent(
      "sobremesacafé da tarde",
    );
    await expect(facts(canvasElement)).toEqual({
      Nota: "★★★★☆4 de 5",
      "Vezes feita": "3",
      Última: "1 nov. 2026",
      Tempo: "1 h 15 min",
      Porções: "12",
    });

    const ingredients = region(canvasElement, "Ingredientes");
    await expect(
      ingredients.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["Massa", "Cobertura"]);
    await expect(ingredients.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Cenoura300 g",
      "Óleo0,5 xíc.",
      "Farinha de trigo2,5 xíc.",
      "Ovos3",
      "Leite1,5 L",
      "Chocolate em pó1 xíc.",
      "Sala gosto",
    ]);

    await expect(region(canvasElement, "Preparo").getAllByRole("listitem")).toHaveLength(3);
    await expect(
      region(canvasElement, "Notas").getByText("Fica melhor no dia seguinte."),
    ).toBeVisible();

    const log = region(canvasElement, "Histórico");
    await expect(log.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "1 nov. 2026",
      "2 mar. 2026Cobertura ficou rala; ferver mais.",
      "24 dez. 2025Fiz para o Natal.",
    ]);

    await expect(canvas.getByText(/Adaptada de/)).toHaveTextContent(
      "Adaptada de youtube.com e panelinha.com.br",
    );
    await expect(canvas.getByRole("link", { name: "youtube.com" })).toHaveAttribute(
      "href",
      complete.sources![0],
    );
  },
};

export const Minimal: Story = {
  args: { recipe: minimal },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(facts(canvasElement)).toEqual({ Nota: "Sem nota", "Vezes feita": "Nunca feita" });
    await expect(canvas.queryByRole("list", { name: "Tags" })).toBeNull();
    await expect(canvas.queryByRole("heading", { level: 3 })).toBeNull();
    await expect(canvas.queryByRole("region", { name: "Notas" })).toBeNull();
    await expect(canvas.queryByRole("region", { name: "Histórico" })).toBeNull();
    await expect(canvas.queryByText(/Adaptada de/)).toBeNull();
    await expect(canvas.getByRole("link", { name: /Todas as receitas/ })).toHaveAttribute(
      "href",
      "/",
    );
  },
};

export const OneSourceMadeOnce: Story = {
  args: {
    recipe: {
      ...minimal,
      sources: ["https://www.bonappetit.com/recipe/carbonara"],
      log: [{ date: "2026-05-09" }],
      rating: 5,
      totalMinutes: 20,
    },
  },
  play: async ({ canvasElement }) => {
    await expect(facts(canvasElement)).toEqual({
      Nota: "★★★★★5 de 5",
      "Vezes feita": "1",
      Última: "9 maio 2026",
      Tempo: "20 min",
    });
    await expect(within(canvasElement).getByText(/Adaptada de/)).toHaveTextContent(
      "Adaptada de bonappetit.com",
    );
  },
};

export const LongTitle: Story = {
  args: {
    recipe: {
      ...minimal,
      title: "Arroz de forno cremoso com frango desfiado, milho, requeijão e queijo gratinado",
      tags: ["jantar", "forno", "família", "congelável", "marmita"],
    },
  },
};

const headerImage = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLImageElement>(".recipe-photo");

export const WithPhoto: Story = {
  args: { recipe: complete, photo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(complete.title);
    await expect(canvas.getByRole("list", { name: "Tags" })).toBeVisible();
    const image = headerImage(canvasElement)!;
    await expect(image.alt).toBe("");
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0));
  },
};

export const WithoutPhoto: Story = {
  args: { recipe: complete },
  play: async ({ canvasElement }) => {
    await expect(headerImage(canvasElement)).toBeNull();
    await expect(within(canvasElement).getByRole("heading", { level: 1 })).toBeVisible();
  },
};

export const LongTitleWithPhoto: Story = {
  args: { ...LongTitle.args, photo },
  play: async ({ canvasElement }) => {
    const title = within(canvasElement).getByRole("heading", { level: 1 });
    const header = canvasElement.querySelector(".recipe-header")!.getBoundingClientRect();
    await expect(title.getBoundingClientRect().top).toBeGreaterThanOrEqual(header.top);
    await expect(title.getBoundingClientRect().bottom).toBeLessThanOrEqual(header.bottom);
  },
};
