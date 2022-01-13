const { test, expect } = require("@playwright/test");
const {
  assertHeaderPresent,
  visitLandingPage,
  clickOnConnectWithStrava,
} = require("./helpers/base");
const {
  mockStravaGetAccessToken,
  mockStravaApiAthlete,
  mockStravaApiActivities,
} = require("./helpers/RequestMocker");

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await visitLandingPage(page);
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test("should allow the user to log in and log out", async ({ page }) => {
    await assertHeaderPresent(page);
    // ASSERT WE ARE NOT LOGGED IN i.e. no profile picture and no username in the top bar (and no activity)
    const userName = page.locator('a:text("Jane Doe")');
    await expect(userName).toHaveCount(0);
    const userAvatar = page.locator("a >> img");
    await expect(userAvatar).toHaveCount(0);
    const activityName = page.locator('a:text("Bike ride")');
    await expect(activityName).toHaveCount(0);

    await clickOnConnectWithStrava(page, { assertRedirectedToStrava: true });
    await page.reload({ waitUntil: "networkidle" });

    await mockStravaGetAccessToken(page);
    await mockStravaApiAthlete(page);
    await mockStravaApiActivities(page);
    await page.goto("http://localhost:9090/?code=FAKE_TEST");
    await assertHeaderPresent(page);
    // ASSERT WE ARE LOGGED IN
    await expect(userName).toBeVisible();
    await expect(userAvatar).toBeVisible();
    await expect(activityName).toBeVisible();

    // ASSERT WE CAN LOG OUT
    const logout = page.locator('button:has-text("Log out")');
    await logout.click();

    // ASSERT WE ARE NO LONGER CONNECTED
    await assertHeaderPresent(page);
    await expect(userName).toHaveCount(0);
    expect(page.url()).toBe("http://localhost:9090/?");
  });
});
