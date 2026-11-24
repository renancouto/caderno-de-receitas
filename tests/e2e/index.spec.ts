import { expect, test, type Page } from "@playwright/test";

test("the index is one A–Z list in Portuguese order", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Minhas receitas");
  await expect(page.locator(".index-section")).toHaveText("Índice · 5");
  await expect(page.getByRole("navigation", { name: "Letras" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(0);

  await expect(page.getByRole("listitem")).toHaveText([
    /Abóbora assada.*–\/5.*1 h · Nunca feita/,
    /Bolo de cenoura com cobertura.*4\/5.*1 h 15 min · Feita · 2/,
    /Carbonara picante.*–\/5.*Nunca feita/,
    /Pão de queijo.*5\/5.*45 min · Feita · 2/,
    /Pudim.*3\/5.*4 h · Feita · 1/,
  ]);
  await expect(page.getByRole("link", { name: "Limpar" })).toHaveCount(0);
});

test("an entry opens its Recipe and going back returns to the index", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: /Pão de queijo/ }).click();
  await expect(page).toHaveURL(/\/recipes\/pao-de-queijo\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pão de queijo");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Minhas receitas");
});

const titles = (page: Page) => page.getByRole("listitem").locator(".index-entry-title");

test("each order lists Recipes in its order with missing values last", async ({ page }) => {
  await page.goto("./");
  const entries = page.getByRole("listitem");

  await page.getByRole("link", { name: "Nota", exact: true }).click();
  await expect(page).toHaveURL(/\?order=rating$/);
  await expect(titles(page)).toHaveText([
    "Pão de queijo",
    "Bolo de cenoura com cobertura",
    "Pudim",
    "Abóbora assada",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("5/5");

  await page.getByRole("link", { name: "Mais feitas" }).click();
  await expect(titles(page)).toHaveText([
    "Bolo de cenoura com cobertura",
    "Pão de queijo",
    "Pudim",
    "Abóbora assada",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("Feita · 2");
  await expect(entries.last()).toContainText("–/5");

  await page.getByRole("link", { name: "Há mais tempo" }).click();
  await expect(titles(page)).toHaveText([
    "Pudim",
    "Pão de queijo",
    "Bolo de cenoura com cobertura",
    "Abóbora assada",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("3/5");

  await page.getByRole("link", { name: "Mais rápidas" }).click();
  await expect(page).toHaveURL(/\?order=quickest$/);
  await expect(titles(page)).toHaveText([
    "Pão de queijo",
    "Abóbora assada",
    "Bolo de cenoura com cobertura",
    "Pudim",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("45 min");
  await expect(entries.last()).toContainText("–/5");

  await page.getByRole("link", { name: "Limpar" }).click();
  await expect(page).not.toHaveURL(/order=/);
  await expect(titles(page).first()).toHaveText("Abóbora assada");
});

test("a Tag filters the list, combines with the order and Limpar resets everything", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("link", { name: "sobremesa" }).click();
  await expect(page).toHaveURL(/\?tag=sobremesa$/);
  await expect(page.locator(".index-section")).toHaveText("Índice · 2");
  await expect(titles(page)).toHaveText(["Bolo de cenoura com cobertura", "Pudim"]);

  await page.getByRole("link", { name: "Nota", exact: true }).click();
  await expect(page).toHaveURL(/\?order=rating&tag=sobremesa$/);
  await expect(titles(page)).toHaveText(["Bolo de cenoura com cobertura", "Pudim"]);
  await page.getByRole("link", { name: "Mais feitas" }).click();
  await expect(titles(page)).toHaveText(["Bolo de cenoura com cobertura", "Pudim"]);

  await page.getByRole("searchbox", { name: "Buscar receitas" }).fill("pudim");
  await page.getByRole("link", { name: "Limpar" }).click();
  await expect(page).toHaveURL(/\/minhas-receitas\/?$/);
  await expect(page.getByRole("searchbox", { name: "Buscar receitas" })).toHaveValue("");
  await expect(page.locator(".index-section")).toHaveText("Índice · 5");
});

test("reloading and going back keep the view", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "salgado" }).click();
  await page.getByRole("link", { name: "Nota", exact: true }).click();
  await expect(titles(page)).toHaveText(["Pão de queijo"]);

  await page.reload();
  await expect(page.getByRole("link", { name: "Nota", exact: true })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByRole("link", { name: "salgado" })).toHaveAttribute("aria-current", "true");
  await expect(titles(page)).toHaveText(["Pão de queijo"]);

  await page.goBack();
  await expect(page).toHaveURL(/\?tag=salgado$/);
  await expect(page.getByRole("link", { name: "Nota", exact: true })).not.toHaveAttribute(
    "aria-current",
    "true",
  );
  await page.goBack();
  await expect(page.locator(".index-section")).toHaveText("Índice · 5");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the A–Z index still lists every Recipe", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator(".index-section")).toHaveText("Índice · 5");
    await expect(page.getByRole("listitem")).toHaveCount(5);
  });
});

test.describe("search", () => {
  // Typing before the island hydrates would be lost.
  const search = async (page: Page, text: string) => {
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    await page.getByRole("searchbox", { name: "Buscar receitas" }).fill(text);
  };
  const entries = (page: Page) => page.locator(".index-list").getByRole("link");

  test("finds a Recipe by its title", async ({ page }) => {
    await page.goto("./");
    await search(page, "pudim");
    await expect(entries(page)).toHaveText([/Pudim/]);
    await expect(page).toHaveURL(/\?q=pudim$/);
  });

  test("finds a Recipe by an Ingredient", async ({ page }) => {
    await page.goto("./");
    await search(page, "condensado");
    await expect(entries(page)).toHaveText([/Pudim/]);
  });

  test("finds a Recipe by a word in the Notes", async ({ page }) => {
    await page.goto("./");
    await search(page, "dia seguinte");
    await expect(entries(page)).toHaveText([/Bolo de cenoura com cobertura/]);
  });

  test("says so when nothing matches", async ({ page }) => {
    await page.goto("./");
    await search(page, "feijoada");
    await expect(page.getByText("Nenhuma receita encontrada.")).toBeVisible();
    await search(page, "");
    await expect(page.locator(".index-section")).toHaveText("Índice · 5");
  });

  test("ignores interface labels, matching only Recipe content", async ({ page }) => {
    await page.goto("./");
    await search(page, "preparo");
    await expect(page.getByText("Nenhuma receita encontrada.")).toBeVisible();
    await search(page, "dourar");
    await expect(entries(page)).toHaveText([/Pão de queijo/]);
  });

  test("combines with a Tag and is restored from the address", async ({ page }) => {
    await page.goto("./?q=asse");
    await expect(entries(page)).toHaveText([
      /Abóbora/,
      /Bolo de cenoura/,
      /Pão de queijo/,
      /Pudim/,
    ]);
    await page.getByRole("link", { name: "salgado" }).click();
    await expect(entries(page)).toHaveText([/Pão de queijo/]);
    await expect(page).toHaveURL(/\?q=asse&tag=salgado$/);
  });
});
