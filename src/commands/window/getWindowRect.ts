export default async function getWindowRect(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Get viewport size
    const viewport = page.viewportSize();

    // For Playwright, we can't get the actual window position
    // So we set x, y to 0, 0 by default
    return {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    };
  } catch (err: any) {
    throw new Error(`Failed to get window rect: ${err.message}`);
  }
}
