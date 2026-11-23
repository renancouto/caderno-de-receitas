import { expect, test } from "@playwright/test";

test("the index lists a Recipe that links to its Recipe page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Caderno de receitas");
  await page.getByRole("link", { name: "Carbonara picante" }).click();

  await expect(page).toHaveURL(/\/recipes\/carbonara-picante\/?$/);
  await expect(page).toHaveTitle("Carbonara picante · Caderno de receitas");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Carbonara picante");
  await expect(page.getByRole("region", { name: "Ingredientes" })).toContainText("200 g");
  await expect(page.getByRole("region", { name: "Preparo" }).getByRole("listitem")).toHaveText([
    "Cozinhe a massa.",
    "Misture com os ovos.",
  ]);
});
