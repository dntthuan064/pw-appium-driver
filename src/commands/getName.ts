export default async function getName(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Get the tag name of the element
    const tagName = await element.evaluate((el: any) => {
      return el.tagName;
    });

    // Return the tag name in lowercase as per WebDriver spec
    return tagName.toLowerCase();
  } catch (err: any) {
    throw new Error(`Failed to get element tag name: ${err.message}`);
  }
}
