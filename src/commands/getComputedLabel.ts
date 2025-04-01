export default async function getComputedLabel(this: any, elementId: string) {
  const element = this.elementCache.get(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found in cache`);
  }
  
  try {
    // Get the accessible name
    return element.evaluate((el: any) => {
      // Try to get label from aria-label
      if (el.getAttribute('aria-label')) {
        return el.getAttribute('aria-label');
      }
      
      // Try to get label from associated label element
      if (el.id) {
        const labels = document.querySelectorAll(`label[for="${el.id}"]`);
        if (labels.length > 0) {
          return labels[0].textContent || '';
        }
      }
      
      // Try to get text content of the element itself
      return el.textContent || '';
    });
  } catch (err: any) {
    throw new Error(`Failed to get computed label: ${err.message}`);
  }
} 