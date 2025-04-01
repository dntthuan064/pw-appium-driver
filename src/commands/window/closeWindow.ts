export default async function closeWindow(this: any) {
  const page = this.windows[this.currentHandle];
  
  // Close the current window/page
  await page.close();
  
  // Remove window handle from cache
  delete this.windows[this.currentHandle];
  
  // Get remaining window handles
  const windowHandles = Object.keys(this.windows);
  
  // Set current handle to first available if there are any windows left
  this.currentHandle = windowHandles.length > 0 ? windowHandles[0] : undefined;
  
  return windowHandles;
} 