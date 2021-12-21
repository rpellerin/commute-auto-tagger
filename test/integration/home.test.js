describe("Langing page", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:9090");
  });

  it("should display the full landing page", async () => {
    await expect(page).toMatchElement("h3", { text: "What's this website?" });
    await expect(page).toMatchElement("h3", {
      text: "What's a potential commute?",
    });
    await expect(page).toMatchElement("h3", {
      text: "How do we determine potential commutes?",
    });
  });
});
