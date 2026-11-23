import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["./", "recipes/carbonara-picante"]) {
  test(`${path} has no accessibility violations, including colour contrast`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(violations).toEqual([]);
  });
}
