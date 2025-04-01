export default async function getUrl(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    return await page.url();
  } catch (err: any) {
    throw new Error(`Failed to get current URL: ${err.message}`);
  }
} 