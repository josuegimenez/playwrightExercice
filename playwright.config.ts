import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  timeout: 5 * 60 * 1000, // Setup timeout to 5 minutes.

  use: {
    headless: false, // Turn off headless mode.
  },
};

export default config;
