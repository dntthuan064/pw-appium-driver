export default async function setWindowRect(this: any, x: number, y: number, width: number, height: number) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Playwright can only set viewport size, not position
    await page.setViewportSize({
      width,
      height
    });
    
    return {
      x: 0, // We can't actually set x position in Playwright
      y: 0, // We can't actually set y position in Playwright
      width,
      height
    };
  } catch (err: any) {
    throw new Error(`Failed to set window rect: ${err.message}`);
  }
} 