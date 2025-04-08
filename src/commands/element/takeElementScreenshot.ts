export default async function takeElementScreenshot(
  this: any,
  elementId: string,
) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Take a screenshot of the element
    const screenshot = await element.screenshot({
      type: "png",
      omitBackground: false,
    });

    // Return the screenshot as a base64 encoded string
    return screenshot.toString("base64");
  } catch (err: any) {
    throw new Error(`Failed to take element screenshot: ${err.message}`);
  }
}
