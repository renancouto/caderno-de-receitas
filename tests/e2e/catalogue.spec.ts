import { expect, test } from "@playwright/test";

test("the index lists a Recipe that links to its Recipe page", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("Caderno de receitas");
  await page.getByRole("link", { name: "Carbonara picante" }).click();

  await expect(page).toHaveURL(/\/caderno-de-receitas\/recipes\/carbonara-picante\/?$/);
  await expect(page).toHaveTitle("Carbonara picante · Caderno de receitas");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Carbonara picante");
  await expect(page.getByRole("region", { name: "Ingredientes" })).toContainText("200 g");
  await expect(page.getByRole("region", { name: "Preparo" }).getByRole("listitem")).toHaveText([
    "Cozinhe a massa.",
    "Misture com os ovos.",
  ]);
});

test("pages load their fonts from the site itself", async ({ page, baseURL }) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("recipes/carbonara-picante");
  await page.evaluate(() => document.fonts.ready);

  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((font) => font.status === "loaded").map((font) => font.family),
  );
  expect(new Set(loaded)).toEqual(new Set(["Fraunces", "Newsreader", "Libre Caslon Text"]));
  expect([...origins]).toEqual([new URL(baseURL!).origin]);
});
