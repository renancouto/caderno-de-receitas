import { expect, test, type Page } from "@playwright/test";

test("the index groups Recipes by first letter in Portuguese order", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Índice");
  await expect(page.getByText("Receitas · 5")).toBeVisible();

  const letters = page.getByRole("navigation", { name: "Letras" }).getByRole("link");
  await expect(letters).toHaveText(["A", "B", "C", "P"]);

  const groupP = page.getByRole("region", { name: "P" });
  await expect(groupP.getByRole("listitem")).toHaveText([
    /Pão de queijo.*★★★★★.*45 min · 2×/,
    /Pudim.*★★★☆☆.*4 h · 1×/,
  ]);
  await expect(page.getByRole("region", { name: "B" }).getByRole("listitem")).toHaveText(
    /Bolo de cenoura com cobertura.*★★★★☆.*1 h 15 min · 2×/,
  );
  await expect(page.getByRole("region", { name: "C" }).getByRole("listitem")).toHaveText(
    /Carbonara picante.*—.*Nunca feita/,
  );
});

test("a letter jumps to its group", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("navigation", { name: "Letras" }).getByRole("link", { name: "P" }).click();
  await expect(page).toHaveURL(/#letter-P$/);
  await expect(page.getByRole("heading", { name: "P", level: 2 })).toBeInViewport();
});

test("an entry opens its Recipe and going back returns to the index", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: /Pão de queijo/ }).click();
  await expect(page).toHaveURL(/\/recipes\/pao-de-queijo\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pão de queijo");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Índice");
});

const titles = (page: Page) => page.getByRole("listitem").locator(".index-entry-title");

test("each order lists Recipes with its value on the right and missing values last", async ({
  page,
}) => {
  await page.goto("./");
  const entries = page.getByRole("listitem");

  await page.getByRole("link", { name: "Nota", exact: true }).click();
  await expect(page).toHaveURL(/\?order=rating$/);
  await expect(page.getByRole("region")).toHaveCount(0);
  await expect(titles(page)).toHaveText([
    "Pão de queijo",
    "Bolo de cenoura com cobertura",
    "Pudim",
    "Abóbora assada",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("★★★★★");

  await page.getByRole("link", { name: "Mais feitas" }).click();
  await expect(titles(page)).toHaveText([
    "Bolo de cenoura com cobertura",
    "Pão de queijo",
    "Pudim",
    "Abóbora assada",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("2×");
  await expect(entries.last()).toContainText("—");

  await page.getByRole("link", { name: "Há mais tempo" }).click();
  await expect(titles(page)).toHaveText([
    "Pudim",
    "Pão de queijo",
    "Bolo de cenoura com cobertura",
    "Abóbora assada",
    "Carbonara picante",
  ]);
  await expect(entries.first()).toContainText("14 fev. 2026");

  await page.getByRole("link", { name: "A–Z" }).click();
  await expect(page).not.toHaveURL(/order=/);
  await expect(page.getByRole("region")).toHaveCount(4);
});

test("a Tag filters the list, combines with the order and can be cleared", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "sobremesa" }).click();
  await expect(page).toHaveURL(/\?tag=sobremesa$/);
  await expect(page.getByText("Receitas · 2")).toBeVisible();
  await expect(titles(page)).toHaveText(["Bolo de cenoura com cobertura", "Pudim"]);

  await page.getByRole("link", { name: "Nota", exact: true }).click();
  await expect(page).toHaveURL(/\?order=rating&tag=sobremesa$/);
  await expect(titles(page)).toHaveText(["Bolo de cenoura com cobertura", "Pudim"]);
  await page.getByRole("link", { name: "Mais feitas" }).click();
  await expect(titles(page)).toHaveText(["Bolo de cenoura com cobertura", "Pudim"]);

  await page.getByRole("link", { name: "Limpar filtro" }).click();
  await expect(page).toHaveURL(/\?order=times-made$/);
  await expect(page.getByText("Receitas · 5")).toBeVisible();
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
  await expect(page.getByRole("link", { name: "A–Z" })).toHaveAttribute("aria-current", "true");
  await page.goBack();
  await expect(page.getByText("Receitas · 5")).toBeVisible();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the A–Z index still lists every Recipe", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByText("Receitas · 5")).toBeVisible();
    await expect(page.getByRole("region")).toHaveCount(4);
  });
});
