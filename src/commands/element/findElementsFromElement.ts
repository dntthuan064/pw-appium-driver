export default async function findElementsFromElement(this: any, elementId: string, strategy: string, selector: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  let elements = [];
  
  try {
    switch (strategy) {
      case 'css selector':
        elements = await element.$$(selector);
        break;
      case 'xpath':
        elements = await element.$$(`xpath=${selector}`);
        break;
      case 'tag name':
        elements = await element.$$(`//${selector}`);
        break;
      case 'id':
        elements = await element.$$(`#${selector}`);
        break;
      case 'name':
        elements = await element.$$(`[name="${selector}"]`);
        break;
      case 'class name':
        elements = await element.$$(`.${selector}`);
        break;
      case 'link text':
        elements = await element.$$(`a:text-is("${selector}")`);
        break;
      case 'partial link text':
        elements = await element.$$(`a:text-matches("${selector}", "i")`);
        break;
      default:
        throw new Error(`Unsupported locator strategy: ${strategy}`);
    }
  } catch (err: any) {
    throw new Error(`Error finding elements with strategy ${strategy} and selector ${selector}: ${err.message}`);
  }
  
  // Map found elements to WebDriver element references
  return elements.map((el) => {
    const newElementId = `element-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
    this.elementCache.set(newElementId, el);
    return { [this.W3C_ELEMENT_KEY]: newElementId };
  });
} 