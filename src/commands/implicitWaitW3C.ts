import { PlaywrightConnectionError } from '../../lib/utils/connectionErrors';

export default async function implicitWaitW3C(this: any, ms: number) {
  // Set the implicit wait timeout in the driver
  this.timeouts.implicit = ms;
  
  try {
    // Apply timeout to Appium client if it exists
    if (this.appiumClient) {
      await this.appiumClient.setTimeout({ implicit: ms });
    }
    
    // Apply implicit wait for Playwright elements
    if (this.browser) {
      const page = this.windows[this.currentHandle];
      if (page) {
        // Set waitForSelector timeout which is used for implicit element location
        await page.setDefaultTimeout(ms);
        
        // Store the implicit wait setting for future operations
        this.defaultWaitOptions = {
          ...(this.defaultWaitOptions || {}),
          timeout: ms,
          state: 'visible' // This ensures elements are actually visible before returning
        };
      }
    }
  } catch (err) {
    const error = err as Error;
    throw new PlaywrightConnectionError(
      `Failed to set implicit wait timeout: ${error.message}`,
      error
    );
  }
  
  // Return null as per WebDriver spec
  return null;
}