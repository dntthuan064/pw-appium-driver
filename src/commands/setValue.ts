export default async function setValue(this: any, elementId: string, text: string | string[]) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  try {
    // Convert string array to a single string if necessary
    const value = Array.isArray(text) ? text.join('') : text;
    
    // First clear any existing value
    await element.fill('');
    
    // Then type the new value
    await element.type(value);
  } catch (err: any) {
    throw new Error(`Failed to set value: ${err.message}`);
  }
} 