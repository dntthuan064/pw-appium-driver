export default async function pageLoadTimeoutW3C(this: any, ms: number) {
  // Set the page load timeout in the driver
  this.timeouts.pageLoad = ms;
  
  // Apply this timeout to the current page and all future pages
  const page = this.windows[this.currentHandle];
  if (page) {
    await page.setDefaultTimeout(ms);
    await page.setDefaultNavigationTimeout(ms);
  }
  
  // Return null as per WebDriver spec
  return null;
} 