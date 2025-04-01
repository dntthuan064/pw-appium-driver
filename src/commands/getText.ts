export default async function getText(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  try {
    // Get the text content of the element
    const text = await element.evaluate((el: any) => {
      // Handle input elements
      if (el.tagName.toLowerCase() === 'input' && ['text', 'search', 'tel', 'url', 'email', 'password', 'number'].includes(el.type)) {
        return el.value;
      }
      
      // Handle textarea elements
      if (el.tagName.toLowerCase() === 'textarea') {
        return el.value;
      }
      
      // Handle select elements
      if (el.tagName.toLowerCase() === 'select') {
        const selectedOptions = Array.from(el.selectedOptions);
        return selectedOptions.map((option: any) => option.text).join(' ');
      }
      
      // Handle regular elements
      return el.innerText;
    });
    
    return text;
  } catch (err: any) {
    throw new Error(`Failed to get text: ${err.message}`);
  }
} 