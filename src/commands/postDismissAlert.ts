export default async function postDismissAlert(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // If we have a stored dialog handler, call it with accept=false
    if (this.alertDialogHandler) {
      await this.alertDialogHandler(false);
      this.alertDialogHandler = null;
      this.alertText = null;
      this.alertInputText = null;
    } else {
      // Set up dialog handler to auto-dismiss future dialogs
      await page.once('dialog', async (dialog) => {
        this.alertText = dialog.message();
        await dialog.dismiss();
      });
    }
    
    return null;
  } catch (err: any) {
    throw new Error(`Failed to dismiss alert: ${err.message}`);
  }
} 