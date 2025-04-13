export default async function postAcceptAlert(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // If we have a stored dialog handler, call it with accept=true
    if (this.alertDialogHandler) {
      // If we have input text for prompt dialogs, use it
      await this.alertDialogHandler(true, this.alertInputText || "");
      this.alertDialogHandler = null;
      this.alertText = null;
      this.alertInputText = null;
    } else {
      // Set up dialog handler to auto-accept future dialogs
      await page.once("dialog", async (dialog) => {
        this.alertText = dialog.message();
        await dialog.accept(this.alertInputText || "");
      });
    }

    return null;
  } catch (err: any) {
    throw new Error(`Failed to accept alert: ${err.message}`);
  }
}
