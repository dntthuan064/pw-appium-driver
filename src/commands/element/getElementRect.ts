export default async function getElementRect(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Get the bounding client rectangle of the element
    const rect = await element.evaluate((el: any) => {
      const { x, y, width, height } = el.getBoundingClientRect();
      return { x, y, width, height };
    });

    return rect;
  } catch (err: any) {
    throw new Error(`Failed to get element rect: ${err.message}`);
  }
}
