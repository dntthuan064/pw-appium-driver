export default async function getAttribute(
  this: any,
  elementId: string,
  attributeName: string,
) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Get the attribute value
    const attributeValue = await element.evaluate((el: any, name: string) => {
      return el.getAttribute(name);
    }, attributeName);

    return attributeValue;
  } catch (err: any) {
    throw new Error(
      `Failed to get attribute '${attributeName}': ${err.message}`,
    );
  }
}
