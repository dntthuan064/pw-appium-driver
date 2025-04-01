export default async function findElementFromElement(this: any, elementId: string, strategy: string, selector: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  let foundElement;
  
  try {
    switch (strategy) {
      case 'css selector':
        foundElement = await element.$(selector);
        break;
      case 'xpath':
        foundElement = await element.$(`xpath=${selector}`);
        break;
      case 'tag name':
        foundElement = await element.$(`//${selector}`);
        break;
      case 'id':
        foundElement = await element.$(`#${selector}`);
        break;
      case 'name':
        foundElement = await element.$(`[name="${selector}"]`);
        break;
      case 'class name':
        foundElement = await element.$(`.${selector}`);
        break;
      case 'link text':
        foundElement = await element.$(`a:text-is("${selector}")`);
        break;
      case 'partial link text':
        foundElement = await element.$(`a:text-matches("${selector}", "i")`);
        break;
      default:
        throw new Error(`Unsupported locator strategy: ${strategy}`);
    }
  } catch (err: any) {
    throw new Error(`Error finding element with strategy ${strategy} and selector ${selector}: ${err.message}`);
  }
  
  if (!foundElement) {
    throw new Error(`No element found with strategy ${strategy} and selector ${selector}`);
  }
  
  const newElementId = `element-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
  this.elementCache.set(newElementId, foundElement);
  
  return { [this.W3C_ELEMENT_KEY]: newElementId };
} 