export default async function elementDisplayed(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  // Check if element is visible
  return element.evaluate((el: any) => {
    function isElementVisible(elem: any): boolean {
      if (!elem) return false;
      if (elem.nodeType !== Node.ELEMENT_NODE) return false;
      
      const style = window.getComputedStyle(elem);
      if (style.display === 'none') return false;
      if (style.visibility !== 'visible') return false;
      if (parseFloat(style.opacity) === 0) return false;
      
      const rect = elem.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      
      return true;
    }
    
    return isElementVisible(el);
  });
} 