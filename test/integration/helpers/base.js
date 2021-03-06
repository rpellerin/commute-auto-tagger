const { expect } = require("@playwright/test");

const PORT = process.env.CI ? 9090 : 3001;
const BASE_URL = `http://localhost:${PORT}`;

exports.PORT = PORT;
exports.BASE_URL = BASE_URL;

exports.visitLandingPage = async (page) => {
  await page.goto(BASE_URL, { waitUntil: "load" });
};

exports.login = async (page) => {
  await page.goto(`${BASE_URL}/?code=FAKE_TEST`);
};

exports.clickOnConnectWithStrava = async (
  page,
  { assertRedirectedToStrava }
) => {
  await page.click("a[href*=strava] svg");

  if (assertRedirectedToStrava) {
    await expect(page.locator("body")).toContainText("Bad Request");
    await expect(page.url()).toMatch(
      /https:\/\/www\.strava\.com\/oauth\/authorize\?client_id=.*&scope=read,activity:read_all,activity:write/
    );
  }
};

exports.assertHeaderPresent = async (page) => {
  await expect(
    page.locator('h3:has-text("What\'s this website?")')
  ).toBeVisible();

  await expect(
    page.locator('h3:has-text("What\'s a potential commute?")')
  ).toBeVisible();

  await expect(
    page.locator('h3:has-text("How do we determine potential commutes?")')
  ).toBeVisible();
};
