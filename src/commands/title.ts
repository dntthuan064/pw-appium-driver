export default async function title(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    return await page.title();
  } catch (err: any) {
    throw new Error(`Failed to get page title: ${err.message}`);
  }
}
