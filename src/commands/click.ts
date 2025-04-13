export default async function click(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    await element.click();
  } catch (err: any) {
    throw new Error(`Failed to click element: ${err.message}`);
  }
}
