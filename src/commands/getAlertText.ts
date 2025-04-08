export default async function getAlertText(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Playwright doesn't have a direct way to access alert text
    // We use the dialog event to capture the message
    if (!this.alertText) {
      throw new Error("No alert is present or alert text was not captured");
    }

    return this.alertText;
  } catch (err: any) {
    throw new Error(`Failed to get alert text: ${err.message}`);
  }
}
