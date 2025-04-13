export default async function getPageSource(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Get the full HTML content of the page
    return await page.content();
  } catch (err: any) {
    throw new Error(`Failed to get page source: ${err.message}`);
  }
}
