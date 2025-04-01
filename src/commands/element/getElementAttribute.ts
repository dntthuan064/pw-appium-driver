export default async function getElementAttribute(this: any, elementId: string, attribute: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  try {
    // Get the attribute value
    const value = await element.getAttribute(attribute);
    
    // Return null if the attribute doesn't exist
    return value === null ? null : value;
  } catch (err: any) {
    throw new Error(`Failed to get attribute '${attribute}' from element: ${err.message}`);
  }
} 