export default async function deleteCookies(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Get the current context
    const context = page.context();

    // Clear all cookies from the context
    await context.clearCookies();

    return null;
  } catch (err: any) {
    throw new Error(`Failed to delete all cookies: ${err.message}`);
  }
}
