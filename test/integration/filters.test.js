const { test, expect } = require("@playwright/test");
const { assertHeaderPresent, login } = require("./helpers/base");
const { mockStravaGetAccessToken } = require("./helpers/RequestMocker");

test.describe("Filters", () => {
  test.beforeEach(async ({ page }) => {
    await mockStravaGetAccessToken(page);
    await login(page);
    await assertHeaderPresent(page);
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("should display the filters and save their state across page refreshes", async ({
    page,
  }) => {
    const firstFilter = page.locator('label:text("Potential commute")');
    const secondFilter = page.locator("label >> text=/Commute/"); // To be case sensitive
    const thirdFilter = page.locator('label:text("Non commute")');

    await expect(firstFilter).toBeChecked();
    await expect(secondFilter).toBeChecked();
    await expect(thirdFilter).toBeChecked();

    await firstFilter.click();

    await expect(firstFilter).not.toBeChecked();

    await page.reload({ waitUntil: "networkidle" });

    await expect(firstFilter).not.toBeChecked();
    await expect(secondFilter).toBeChecked();
    await expect(thirdFilter).toBeChecked();
  });
});
