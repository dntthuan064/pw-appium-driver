export default async function getShadowRoot(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Check if the element has a shadow root
    const shadowRoot = await element.evaluateHandle((el) => el.shadowRoot);
    if (!shadowRoot || (await shadowRoot.evaluate((root) => root === null))) {
      throw new Error(`Element does not have a shadow root`);
    }

    // Cache the shadow root and return its ID
    const shadowId = `shadow-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
    this.elementCache.set(shadowId, shadowRoot);

    return { [this.W3C_SHADOW_KEY]: shadowId };
  } catch (err: any) {
    throw new Error(`Failed to get shadow root: ${err.message}`);
  }
}
