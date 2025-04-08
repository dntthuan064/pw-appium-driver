export default async function setUrl(this: any, url: string) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Navigate to the provided URL
    await page.goto(url, {
      waitUntil: this.pageLoadStrategy || "load",
    });
  } catch (err: any) {
    throw new Error(`Failed to navigate to ${url}: ${err.message}`);
  }
}
