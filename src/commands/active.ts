export default async function active(this: any) {
  const page = this.windows[this.currentHandle];
  const element = await page.evaluateHandle(() => document.activeElement);

  const elementId = this.generateElementId();
  this.elementCache.set(elementId, element);
  return { [this.W3C_ELEMENT_KEY]: elementId };
}
