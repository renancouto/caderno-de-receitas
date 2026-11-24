import { expect, test, type Page } from "@playwright/test";

const storybook = "http://localhost:6007";

// Every face the site uses, so a screenshot never catches a fallback font.
const fontFaces = [
  "300 1em Fraunces",
  "400 1em Newsreader",
  "italic 400 1em Newsreader",
  '400 1em "Libre Caslon Text"',
];

async function settle(page: Page) {
  await page.evaluate(async (faces) => {
    await Promise.all(faces.map((face) => document.fonts.load(face)));
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, fontFaces);
}

const options = { fullPage: true, animations: "disabled", caret: "hide" } as const;

test("index page", async ({ page }) => {
  await page.goto("./");
  await settle(page);
  await expect(page).toHaveScreenshot("page-index.png", options);
});

test("recipe page", async ({ page }) => {
  await page.goto("recipes/carbonara-picante");
  await settle(page);
  await expect(page).toHaveScreenshot("page-recipe.png", options);
});

test("full recipe page", async ({ page }) => {
  await page.goto("recipes/bolo-de-cenoura");
  await settle(page);
  await expect(page).toHaveScreenshot("page-recipe-full.png", options);
});

// Stories whose play function ticks items: the number of ticked items expected at the end.
const ticks: Record<string, number> = {
  "components-ingredientlist--ticked": 2,
  "components-steplist--ticked": 2,
};

for (const id of [
  "pages-index--default",
  "pages-index--sorted",
  "pages-index--filtered-by-tag",
  "pages-index--searching",
  "pages-index--no-results",
  "components-indexentry--rated",
  "components-indexentry--not-rated",
  "components-indexentry--never-made-without-time",
  "components-indexentry--long-title",
  "pages-recipe--complete",
  "pages-recipe--minimal",
  "pages-recipe--long-title",
  "components-ingredientlist--ticked",
  "components-steplist--ticked",
  "pages-recipe--with-photo",
  "pages-recipe--long-title-with-photo",
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
    await expect(page).toHaveScreenshot(`story-${id}.png`, options);
  });
}
