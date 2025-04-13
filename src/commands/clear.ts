export default async function clear(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    await element.fill("");
  } catch (err: any) {
    throw new Error(`Failed to clear element: ${err.message}`);
  }
}
