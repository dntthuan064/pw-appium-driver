export default async function deleteSession(this: any) {
  if (this.browser) {
    // Close all pages
    for (const handle of Object.keys(this.windows)) {
      const page = this.windows[handle];
      if (page && !page.isClosed()) {
        await page.close().catch(() => {});
      }
    }
    
    // Close the browser
    await this.browser.close().catch(() => {});
    this.browser = undefined;
  }
  
  // Reset the driver state
  this.resetState();
  
  // Call the parent's deleteSession
  await this.executeCommand('deleteSession');
} 