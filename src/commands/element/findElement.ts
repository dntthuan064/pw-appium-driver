export default async function findElement(this: any, strategy: string, selector: string) {
  const page = this.windows[this.currentHandle];
  let element;
  
  try {
    switch (strategy) {
      case 'css selector':
        element = await page.$(selector);
        break;
      case 'xpath':
        element = await page.$(`xpath=${selector}`);
        break;
      case 'tag name':
        element = await page.$(`//${selector}`);
        break;
      case 'id':
        element = await page.$(`#${selector}`);
        break;
      case 'name':
        element = await page.$(`[name="${selector}"]`);
        break;
      case 'class name':
        element = await page.$(`.${selector}`);
        break;
      case 'link text':
        element = await page.$(`a:text-is("${selector}")`);
        break;
      case 'partial link text':
        element = await page.$(`a:text-matches("${selector}", "i")`);
        break;
      default:
        throw new Error(`Unsupported locator strategy: ${strategy}`);
    }
  } catch (err: any) {
    throw new Error(`Error finding element with strategy ${strategy} and selector ${selector}: ${err.message}`);
  }
  
  if (!element) {
    throw new Error(`No element found with strategy ${strategy} and selector ${selector}`);
  }
  
  const elementId = `element-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
  this.elementCache.set(elementId, element);
  
  return { [this.W3C_ELEMENT_KEY]: elementId };
} 