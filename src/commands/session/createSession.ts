export default async function createSession(
  this: any,
  jsonwpDesiredCapabilities: any,
  reqCaps: any,
  w3cCapabilities: any,
) {
  // This will call the parent createSession method which will validate the caps
  const [sessionId, caps] = await this.baseCreateSession(
    jsonwpDesiredCapabilities,
    reqCaps,
    w3cCapabilities,
  );

  if (!caps.platformName) {
    throw new Error("platformName capability is required");
  }

  // Initialize Playwright
  this.playwright = await this.getPlaywright();

  // Launch browser
  const launchOptions: Record<string, any> = {};

  // Set headless mode
  if (caps.headless !== undefined) {
    launchOptions.headless = caps.headless;
  }

  // Set browser arguments if provided
  if (caps.browserArgs) {
    launchOptions.args = caps.browserArgs;
  }

  // Set user data directory if provided
  if (caps.userDataDir) {
    launchOptions.userDataDir = caps.userDataDir;
  }

  // Launch the browser based on the platform name
  this.browser = await this.playwright[caps.platformName].launch(launchOptions);

  // Create a new browser context
  const context = await this.browser.newContext();

  // Create a new page in the context
  const page = await context.newPage();

  // Generate a unique window handle for the page
  const handle = `window-${Date.now()}`;

  // Store the page in the windows cache
  this.windows[handle] = page;

  // Set the current handle to the new page
  this.currentHandle = handle;

  return [sessionId, caps];
}
