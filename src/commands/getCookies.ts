export default async function getCookies(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Get all cookies from the current context
    return await page.context().cookies();
  } catch (err: any) {
    throw new Error(`Failed to get cookies: ${err.message}`);
  }
} 