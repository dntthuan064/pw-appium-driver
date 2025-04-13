export default async function getCssProperty(
  this: any,
  elementId: string,
  propertyName: string,
) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }

  try {
    // Convert property name to camelCase for JavaScript style access
    const camelCasePropertyName = propertyName.replace(
      /-([a-z])/g,
      (match, letter) => letter.toUpperCase(),
    );

    // Get the CSS property value
    const value = await element.evaluate(
      (el: any, propName: string, camelPropName: string) => {
        const styles = window.getComputedStyle(el);
        return (
          styles[camelPropName] || styles.getPropertyValue(propName) || null
        );
      },
      propertyName,
      camelCasePropertyName,
    );

    return value;
  } catch (err: any) {
    throw new Error(
      `Failed to get CSS property '${propertyName}': ${err.message}`,
    );
  }
}
