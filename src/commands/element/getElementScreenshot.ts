export default async function getElementScreenshot(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  try {
    // Take a screenshot of the element
    const screenshot = await element.screenshot({
      type: 'png',
      omitBackground: false
    });
    
    // Convert the binary data to base64
    return screenshot.toString('base64');
  } catch (err: any) {
    throw new Error(`Failed to take element screenshot: ${err.message}`);
  }
} 