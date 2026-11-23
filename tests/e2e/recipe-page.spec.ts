import { expect, test } from "@playwright/test";

test("a full Recipe page shows every part of the Recipe", async ({ page }) => {
  await page.goto("recipes/bolo-de-cenoura");
  await expect(page).toHaveTitle("Bolo de cenoura com cobertura · Caderno de receitas");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bolo de cenoura com cobertura");
  await expect(page.getByRole("list", { name: "Tags" }).getByRole("listitem")).toHaveText([
    "sobremesa",
    "café da tarde",
  ]);
  await expect(page.locator(".fact")).toHaveText([
    "Nota★★★★☆4 de 5",
    "Vezes feita2",
    "Última1 nov. 2026",
    "Tempo1 h 15 min",
    "Porções12",
  ]);

  const ingredients = page.getByRole("region", { name: "Ingredientes" });
  await expect(ingredients.getByRole("heading", { level: 3 })).toHaveText(["Massa", "Cobertura"]);
  await expect(ingredients.getByRole("listitem")).toHaveText([
    "Cenoura300 g",
    "Farinha de trigo2,5 xíc.",
    "Ovos3",
    "Leite1,5 L",
    "Sala gosto",
  ]);
  await expect(page.getByRole("region", { name: "Preparo" }).getByRole("listitem")).toHaveCount(3);
  await expect(page.getByRole("region", { name: "Notas" })).toContainText(
    "Fica melhor no dia seguinte.",
  );
  await expect(page.getByRole("region", { name: "Histórico" }).getByRole("listitem")).toHaveText([
    "1 nov. 2026",
    "24 dez. 2025Fiz para o Natal.",
  ]);
  await expect(page.getByText(/Adaptada de/)).toHaveText(
    "Adaptada de youtube.com e panelinha.com.br",
  );

  await page.getByRole("link", { name: /Todas as receitas/ }).click();
  await expect(page).toHaveURL(/\/caderno-de-receitas\/$/);
});

test("a minimal Recipe page leaves out what the Recipe doesn't have", async ({ page }) => {
  await page.goto("recipes/carbonara-picante");
  await expect(page.locator(".fact")).toHaveText(["NotaSem nota", "Vezes feitaNunca feita"]);
  await expect(page.getByRole("list", { name: "Tags" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Notas" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Histórico" })).toHaveCount(0);
  await expect(page.getByText(/Adaptada de/)).toHaveCount(0);
});

test("Ingredients sit beside the Steps on a wide screen and above them on a phone", async ({
  page,
}) => {
  const ingredients = page.getByRole("heading", { name: "Ingredientes" });
  const steps = page.getByRole("heading", { name: "Preparo" });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("recipes/bolo-de-cenoura");
  let [a, b] = [await ingredients.boundingBox(), await steps.boundingBox()];
  expect(b!.y).toBeGreaterThan(a!.y + a!.height - 1);

  await page.setViewportSize({ width: 1280, height: 900 });
  [a, b] = [await ingredients.boundingBox(), await steps.boundingBox()];
  expect(b!.x).toBeGreaterThan(a!.x + a!.width - 1);
  expect(Math.abs(b!.y - a!.y)).toBeLessThan(2);
});

test("an Ingredient and a Step can be ticked off and unticked", async ({ page }) => {
  await page.goto("recipes/carbonara-picante");
  const ingredient = page.getByRole("button", { name: /Espaguete/ });
  const step = page.getByRole("button", { name: /Cozinhe a massa/ });
  await expect(ingredient).toHaveAttribute("aria-pressed", "false");
  await ingredient.click();
  await step.click();
  await expect(ingredient).toHaveAttribute("aria-pressed", "true");
  await expect(step).toHaveAttribute("aria-pressed", "true");
  await ingredient.click();
  await expect(ingredient).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(step).toHaveAttribute("aria-pressed", "false");
});

test("the Recipe page ships JavaScript only for the tick-off lists", async ({ page }) => {
  await page.goto("recipes/carbonara-picante");
  await expect(page.locator("astro-island")).toHaveCount(2);
  await expect(page.locator("astro-island[client]")).toHaveCount(2);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the lists render as plain lists", async ({ page }) => {
    await page.goto("recipes/carbonara-picante");
    await expect(page.getByRole("button")).toHaveCount(0);
    await expect(
      page.getByRole("region", { name: "Ingredientes" }).getByRole("listitem"),
    ).not.toHaveCount(0);
    await expect(
      page.getByRole("region", { name: "Preparo" }).getByRole("listitem"),
    ).not.toHaveCount(0);
  });
});
