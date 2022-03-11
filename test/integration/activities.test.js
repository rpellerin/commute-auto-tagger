const { test, expect } = require("@playwright/test");
const { assertHeaderPresent, login } = require("./helpers/base");
const { mockStravaGetAccessToken, mockStravaApiAthlete, mockStravaApiActivities } = require("./helpers/RequestMocker");

test.describe("Activities", () => {
  test.beforeEach(async ({ page }) => {
    await mockStravaGetAccessToken(page);
    await mockStravaApiAthlete(page);
    await mockStravaApiActivities(page);
    await login(page);
    await assertHeaderPresent(page);
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("should display the activities of the user which are only of type 'Ride'", async ({
    page,
  }) => {
    const locator = page.locator('ul li h2');
    await expect(locator).toHaveCount(1);
    await expect(locator).toHaveText('Bike ride');
  });
});
