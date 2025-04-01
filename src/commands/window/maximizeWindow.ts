export default async function maximizeWindow(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Playwright doesn't have a direct way to maximize windows
    // We can try to set the viewport to a large size
    const maxViewportSize = {
      width: 1920,  // Large common desktop resolution width
      height: 1080  // Large common desktop resolution height
    };
    
    await page.setViewportSize(maxViewportSize);
    
    // Return the new window rect
    return {
      x: 0,
      y: 0,
      width: maxViewportSize.width,
      height: maxViewportSize.height
    };
  } catch (err: any) {
    throw new Error(`Failed to maximize window: ${err.message}`);
  }
} 