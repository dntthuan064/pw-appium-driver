export default async function setAlertText(this: any, text: string) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Store the text to be used when accepting the dialog
    this.alertInputText = text;

    if (!this.alertDialogHandler) {
      throw new Error("No alert is present or dialog handler is not set up");
    }

    return null;
  } catch (err: any) {
    throw new Error(`Failed to set alert text: ${err.message}`);
  }
}
