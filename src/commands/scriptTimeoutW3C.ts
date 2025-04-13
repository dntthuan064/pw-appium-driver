import { PlaywrightConnectionError } from "../../lib/utils/connectionErrors";

export default async function scriptTimeoutW3C(this: any, ms: number) {
  // Set the script timeout in the driver
  this.timeouts.script = ms;

  try {
    // Apply timeout to Appium client if it exists
    if (this.appiumClient) {
      await this.appiumClient.setTimeout({ script: ms });
    }

    // Apply script timeout for Playwright
    if (this.browser) {
      const page = this.windows[this.currentHandle];
      if (page) {
        await page.setDefaultTimeout(ms);

        // Set evaluation timeout for JavaScript execution
        this.defaultEvalOptions = {
          ...(this.defaultEvalOptions || {}),
          timeout: ms,
        };
      }
    }
  } catch (err) {
    const error = err as Error;
    throw new PlaywrightConnectionError(
      `Failed to set script timeout: ${error.message}`,
      error,
    );
  }

  // Return null as per WebDriver spec
  return null;
}
