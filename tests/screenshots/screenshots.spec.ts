import { expect, test, type Page } from "@playwright/test";

const storybook = "http://localhost:6007";

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
}

test("index page", async ({ page }) => {
  await page.goto("./");
  await settle(page);
  await expect(page).toHaveScreenshot("page-index.png", { fullPage: true });
});

test("recipe page", async ({ page }) => {
  await page.goto("recipes/carbonara-picante");
  await settle(page);
  await expect(page).toHaveScreenshot("page-recipe.png", { fullPage: true });
});

for (const id of ["components-indexpage--one-recipe", "components-recipepage--default"]) {
  test(`story ${id}`, async ({ page }) => {
    await page.goto(`${storybook}/iframe.html?id=${id}&viewMode=story`);
    await page.locator("#storybook-root > *").first().waitFor();
    await settle(page);
    await expect(page).toHaveScreenshot(`story-${id}.png`, { fullPage: true });
  });
}
