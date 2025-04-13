export default async function getProperty(
  this: any,
  elementId: string,
  propertyName: string,
) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Get the property value
    const propertyValue = await element.evaluate((el: any, name: string) => {
      return el[name];
    }, propertyName);

    return propertyValue;
  } catch (err: any) {
    throw new Error(`Failed to get property '${propertyName}': ${err.message}`);
  }
}
