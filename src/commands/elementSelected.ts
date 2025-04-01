export default async function elementSelected(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  // Check if element is selected
  return element.evaluate((el: any) => {
    if (el.selected !== undefined) {
      return !!el.selected;
    }
    
    if (el.type && (el.type.toLowerCase() === 'checkbox' || el.type.toLowerCase() === 'radio')) {
      return !!el.checked;
    }
    
    if (el.tagName && el.tagName.toLowerCase() === 'option') {
      return !!el.selected;
    }
    
    return false;
  });
} 