export default async function createWindow(this: any, type: string) {
  if (!this.browser) {
    throw new Error('Browser not initialized');
  }
  
  try {
    // Get a reference to the browser context
    const context = await this.browser.newContext();
    
    // Create a new page
    const page = await context.newPage();
    
    // Generate a unique window handle
    const handle = `window-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
    
    // Store the page in the windows cache
    this.windows[handle] = page;
    
    // Set the current handle to the new page
    this.currentHandle = handle;
    
    return {
      handle,
      type
    };
  } catch (err: any) {
    throw new Error(`Failed to create new window: ${err.message}`);
  }
} 