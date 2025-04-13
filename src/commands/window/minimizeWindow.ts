export default async function minimizeWindow(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Playwright doesn't have a direct way to minimize windows
    // This is a limitation of the browser automation
    // We can set a small viewport size as a fallback
    const minViewportSize = {
      width: 640, // Small viewport width
      height: 480, // Small viewport height
    };

    await page.setViewportSize(minViewportSize);

    // Return the new window rect
    return {
      x: 0,
      y: 0,
      width: minViewportSize.width,
      height: minViewportSize.height,
    };
  } catch (err: any) {
    throw new Error(`Failed to minimize window: ${err.message}`);
  }
}
