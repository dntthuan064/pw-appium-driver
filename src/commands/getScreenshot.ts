export default async function getScreenshot(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Take a screenshot of the entire page
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    });
    
    // Convert the binary data to base64
    return screenshot.toString('base64');
  } catch (err: any) {
    throw new Error(`Failed to take screenshot: ${err.message}`);
  }
} 