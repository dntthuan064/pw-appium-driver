export default async function findElementFromShadowRoot(
  this: any,
  shadowId: string,
  strategy: string,
  selector: string,
) {
  const shadowRoot = this.elementCache.get(shadowId);
  if (!shadowRoot) {
    throw new Error(`Shadow root with id ${shadowId} not found in cache`);
  }

  let element;

  try {
    switch (strategy) {
      case "css selector":
        element = await shadowRoot.$(selector);
        break;
      case "tag name":
        element = await shadowRoot.$(`//${selector}`);
        break;
      default:
        throw new Error(
          `Unsupported locator strategy for shadow DOM: ${strategy}`,
        );
    }
  } catch (err: any) {
    throw new Error(
      `Error finding element in shadow root with strategy ${strategy} and selector ${selector}: ${err.message}`,
    );
  }

  if (!element) {
    throw new Error(
      `No element found in shadow root with strategy ${strategy} and selector ${selector}`,
    );
  }

  const elementId = `element-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
  this.elementCache.set(elementId, element);

  return { [this.W3C_ELEMENT_KEY]: elementId };
}
