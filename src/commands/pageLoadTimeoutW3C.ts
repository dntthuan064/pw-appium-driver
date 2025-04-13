import { PlaywrightConnectionError } from "../../lib/utils/connectionErrors";

export default async function pageLoadTimeoutW3C(this: any, ms: number) {
  // Set the page load timeout in the driver
  this.timeouts.pageLoad = ms;

  try {
    // Apply timeout to Appium client if it exists
    if (this.appiumClient) {
      await this.appiumClient.setTimeout({ pageLoad: ms });
    }

    // Apply this timeout to the current page and all future pages for Playwright
    if (this.browser) {
      const context = await this.browser.newContext({
        navigationTimeout: ms,
        timeout: ms,
      });

      const page = this.windows[this.currentHandle];
      if (page) {
        await page.setDefaultTimeout(ms);
        await page.setDefaultNavigationTimeout(ms);
      }

      // Store the context configuration for future pages
      this.defaultContextOptions = {
        ...(this.defaultContextOptions || {}),
        navigationTimeout: ms,
        timeout: ms,
      };
    }
  } catch (err) {
    const error = err as Error;
    throw new PlaywrightConnectionError(
      `Failed to set page load timeout: ${error.message}`,
      error,
    );
  }

  // Return null as per WebDriver spec
  return null;
}
