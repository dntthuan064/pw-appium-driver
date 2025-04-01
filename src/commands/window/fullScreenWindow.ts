export default async function fullScreenWindow(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Use Playwright's fullscreen mode
    await page.evaluate(() => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        (document.documentElement as any).mozRequestFullScreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen();
      }
    });
    
    // Wait a moment for the fullscreen mode to take effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return the updated window rect
    const viewportSize = page.viewportSize();
    return {
      x: 0,
      y: 0,
      width: viewportSize.width,
      height: viewportSize.height
    };
  } catch (err: any) {
    throw new Error(`Failed to fullscreen window: ${err.message}`);
  }
} 