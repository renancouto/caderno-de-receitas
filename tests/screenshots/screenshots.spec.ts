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

test("full recipe page", async ({ page }) => {
  await page.goto("recipes/bolo-de-cenoura");
  await settle(page);
  await expect(page).toHaveScreenshot("page-recipe-full.png", { fullPage: true });
});

// Stories whose play function ticks items: the number of ticked items expected at the end.
const ticks: Record<string, number> = {
  "components-ingredientlist--ticked": 2,
  "components-steplist--ticked": 2,
};

for (const id of [
  "components-indexpage--one-recipe",
  "components-recipepage--complete",
  "components-recipepage--minimal",
  "components-recipepage--long-title",
  "components-ingredientlist--ticked",
  "components-steplist--ticked",
]) {
  test(`story ${id}`, async ({ page }) => {
    await page.goto(`${storybook}/iframe.html?id=${id}&viewMode=story`);
    await page.locator("#storybook-root > *").first().waitFor();
    await page.waitForFunction(() => {
      const render = (window as any).__STORYBOOK_PREVIEW__?.currentRender;
      return render?.phase === "finished";
    });
    await settle(page);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.move(800, 600);
    const ticked = ticks[id];
    if (ticked) await expect(page.locator('[aria-pressed="true"]')).toHaveCount(ticked);
    await expect(page).toHaveScreenshot(`story-${id}.png`, { fullPage: true });
  });
}
