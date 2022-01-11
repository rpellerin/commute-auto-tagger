describe("Landing page", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:9090");
  });

  it("should display the filters and save their state across page refreshes", async () => {
    await expect(page).toMatchElement("h3", { text: "What's this website?" });
    await expect(page).toMatchElement("h3", {
      text: "What's a potential commute?",
    });
    await expect(page).toMatchElement("h3", {
      text: "How do we determine potential commutes?",
    });

    await page.click("a[href*=strava] svg"); // Click on "Connect with Strava"
    expect(page.url()).toMatch(
      /https:\/\/www\.strava\.com\/oauth\/authorize\?client_id=.*&scope=read,activity:read_all,activity:write/
    );

    await page.setRequestInterception(true);

    page.on("request", (request) => {
      if (request.url().match(/\/strava-get-access-token/)) {
        request.respond({
          body: JSON.stringify({
            token_type: "Bearer",
            expires_at: new Date().getTime() + 21600,
            expires_in: 21600, // 6 hours
            refresh_token: "fake_refresh_token",
            access_token: "fake_access_token",
            athlete: {
              id: 0,
            },
          }),
        });
      } else request.continue();
    });

    await page.goto("http://localhost:9090/?code=FAKE_TEST");
    await expect(page).toMatchElement("h3", { text: "What's this website?" });

    let filters = await page.$x('//*[@id="filters"]/label/input');
    for (const filter of filters) {
      let inputValue;

      inputValue = await filter.getProperty("checked");
      inputValue = await inputValue.jsonValue();

      expect(inputValue).toBe(true);
    }

    const [element] = await page.$x(
      "//label[contains(., 'Potential commute')]"
    );
    await element.click();

    const unchecked_filter = await page.$(
      "#filters label:first-child input:not(:checked)"
    );
    expect(unchecked_filter).toBeTruthy();
    await page.reload();
    const [first_filter] = await page.$x('//*[@id="filters"]/label[1]/input');
    const [second_filter] = await page.$x('//*[@id="filters"]/label[2]/input');
    const [third_filter] = await page.$x('//*[@id="filters"]/label[3]/input');
    let inputValue;
    for (const filter of [second_filter, third_filter]) {
      inputValue = await filter.getProperty("checked");
      inputValue = await inputValue.jsonValue();

      expect(inputValue).toBe(true);
    }
    inputValue = await first_filter.getProperty("checked");
    inputValue = await inputValue.jsonValue();
    expect(inputValue).toBe(false);
  });
});
