import { test, expect } from "@playwright/test";
import { builderPage } from "../builderPO";
import { liveAppPage } from "../liveAppPO";

// Json with all the sensitive data related to user
// In real life world this "data.json" would be included in ".gitignore"
const dataset = JSON.parse(JSON.stringify(require("../data/data.json")));

test("Filtering Inventory", async ({ page, context }) => {
  const builder = new builderPage(page);

  // 1.    Navigate to the Knack Builder login url for your app.
  // 2.    Login.
  builder.goAndLoginOnBuilder(dataset.builder.email, dataset.builder.password);

  // 3.    Click on the Records Tab.
  await page.getByText("Records").click();

  // 4.    Click on the `Warehouse Inventory` Object in the left nav.
  await page.getByText("Warehouse Inventory").click();

  // 5.    Click on the “Add filters” button.
  await page.getByText("Add filters").click();

  // 6.    Filter on “Needs Re-Order” “is” “Yes” and then click Submit.
  await page.locator(".field-list-field").selectOption("Needs Re-Order");
  await page.locator(".kn-multiSelect select").selectOption("Yes");
  await page.getByRole("button", { name: "Submit" }).click();

  // Wait for spinner to load
  try {
    await page.locator("#loader-bg").first().waitFor({ state: "visible", timeout: 2000 });
    await page.locator("#loader-bg").first().waitFor({ state: "hidden", timeout: 2000 });
  } catch (error) {
    // In case loader-bg already disappear, the test continues without failing
  }

  // 7.    Validate that EVERY “Needs Re-Order” table cell is set to “Yes”.
  const recordsinBuilder: string[] = await page.locator('[id*="-10"]').allInnerTexts();
  for (const cellText of recordsinBuilder) {
    expect(cellText).toEqual("Yes");
  }
  // 8.    Count and store the number of records displayed in the table.
  const numberOfRecordsinBuilder = await page.locator('[id*="-10"]').count();

  // 9.    Go to the Live App (there is a link to the Live App in the top header).
  builder.goToLiveApp();
  const [pageLiveApp] = await Promise.all([context.waitForEvent("page")]);
  const liveApp = new liveAppPage(pageLiveApp);

  // 10.  Login as the admin (username: admin@test.com) (password: test).
  await liveApp.loginOnLiveApp(dataset.liveApp.email, dataset.liveApp.password);

  // 11.  Navigate to the Inventory tab.
  await pageLiveApp.locator("#app-menu-list").getByRole("link", { name: "Inventory" }).click();

  // 12.  Click on the “Add filters” button.
  await pageLiveApp.getByText("Add filters").click();

  // 13.  Filter on “Needs Re-Order” “is” “Yes” and then click Submit.
  await pageLiveApp.locator(".field.select").selectOption("Needs Re-Order");
  await pageLiveApp.locator(".kn-select.value select").selectOption("Yes");
  await pageLiveApp.locator('[type="submit"]').click();

  // Wait for spinner to load
  await pageLiveApp.locator("#kn-loading-spinner").waitFor({ state: "visible", timeout: 3000 });
  await pageLiveApp.locator("#kn-loading-spinner").waitFor({ state: "hidden", timeout: 3000 });

  // Count the number of records in Live App
  const numberOfRecordsinLiveApp = await pageLiveApp.locator("td.field_142").count();

  // 14.  Validate that EVERY “Needs Re-Order” table cell is set to “Yes”.
  const recordsinLiveApp = await pageLiveApp.locator("td.field_142").allInnerTexts();
  for (const cellText of recordsinLiveApp) {
    expect(cellText).toEqual("Yes");
  }

  // 15.  Validate that the number of records matches the number of records shown in the builder Records Tab (the number from step 6).
  expect(numberOfRecordsinLiveApp).toEqual(numberOfRecordsinBuilder);
});
