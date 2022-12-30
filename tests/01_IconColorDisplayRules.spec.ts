import { test, expect } from "@playwright/test";
import { color } from "pengrape";
import { builderPage } from "../builderPO";
import { liveAppPage } from "../liveAppPO";

// Json with all the sensitive data related to user
// In real life world this "data.json" would be included in ".gitignore"
const dataset = JSON.parse(JSON.stringify(require("../data/data.json")));

test("Icon Color for Display Rules", async ({ page, context }) => {
  const builder = new builderPage(page);

  // 1.    Navigate to the Knack Builder login url for your app.
  // 2.    Login.
  builder.goAndLoginOnBuilder(dataset.builder.email, dataset.builder.password);

  // 3.    Click on the Pages Tab.
  await page.getByText("Pages").click();

  // 4.    Click on the `Admin > Inventory` page in the left nav.
  await page.getByText("Admin > Inventory").click();

  // 5.    Click on the `Inventory` page in the left nav.
  await page.getByText("Inventory", { exact: true }).click();

  // 6.    Click to activate the `Warehouse Inventory` View.
  await page.locator(".view").click();

  // 7.    Click on the On-Hand column header to open the column properties for that column.
  await page.getByText("On-Hand").click({ force: true });

  // 8.    Under Display Rules, validate that a display rule exists that sets an icon.
  await expect(page.getByText("Display Rule #1")).toBeVisible();
  await expect(page.locator(".display-rule-actions select")).toHaveValue("icon");

  // 9.    Use pengrape to generate a random color.
  const randomColor = color({ format: "hex" });

  // 10.  Update the Display Rule Icon color to this random color.
  await page.locator(".kn-colorInput_input").fill(randomColor);

  // 11.  Click `Save Changes` in the left nav.
  await builder.saveChanges();

  // 12.  Go to the Live App (there is a link to the Live App in the top header).
  await builder.goToLiveApp();

  const [pageLiveApp] = await Promise.all([context.waitForEvent("page")]);
  const liveApp = new liveAppPage(pageLiveApp);

  // 13.  Login as the admin (username: admin@test.com) (password: test).
  await liveApp.loginOnLiveApp(dataset.liveApp.email, dataset.liveApp.password);

  // 14.  Navigate to the Inventory tab.
  await pageLiveApp.locator("#app-menu-list").getByRole("link", { name: "Inventory" }).click();

  //Wait for spinner to load
  await pageLiveApp.locator("#kn-loading-spinner").waitFor({ state: "visible", timeout: 3000 });
  await pageLiveApp.locator("#kn-loading-spinner").waitFor({ state: "hidden", timeout: 3000 });

  // 15.  Validate that the icon next to On-Hand values of 0 is set to the new color that was defined in Step 9.
  const randomColorRGB = await liveApp.hexToRGB(randomColor);
  const warningIcons = await pageLiveApp.locator(".col-6 .fa.fa-warning").all();
  for (const locator of warningIcons) {
    await expect(locator).toHaveCSS("color", String(randomColorRGB));
  }
});
