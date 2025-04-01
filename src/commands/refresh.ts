export default async function refresh(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    await page.reload();
  } catch (err: any) {
    throw new Error(`Failed to refresh page: ${err.message}`);
  }
} 