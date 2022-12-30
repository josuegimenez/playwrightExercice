const dataset = JSON.parse(JSON.stringify(require("./data/data.json")));

export class builderPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.URL = `https://builder.knack.com/${dataset.builder.user}/warehouse-manager/login`;
  }

  async goAndLoginOnBuilder(email, password) {
    await this.page.goto(this.URL);
    await this.page.locator("#email").nth(1).fill(email);
    await this.page.locator("#password").last().fill(password);
    await this.page.locator("[type='submit']").last().click();
  }
  async goToLiveApp() {
    await this.page.locator(".accessMenu_directLink").click();
  }
  async saveChanges() {
    await this.page.getByText(" save changes ").click();
  }
}
