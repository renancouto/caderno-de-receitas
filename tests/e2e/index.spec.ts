import { expect, test } from "@playwright/test";

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
