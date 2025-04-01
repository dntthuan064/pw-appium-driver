export default async function deleteCookie(this: any, name: string) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error('No current window/page available');
  }
  
  try {
    // Get current URL to extract domain information
    const url = await page.url();
    const domain = new URL(url).hostname;
    
    // Get all cookies
    const cookies = await page.context().cookies();
    
    // Find the cookie with the specified name
    const cookie = cookies.find((c) => c.name === name);
    
    if (!cookie) {
      // If cookie doesn't exist, just return
      return null;
    }
    
    // Delete the cookie by setting it with an expired date
    await page.context().addCookies([{
      name,
      value: '',
      domain: cookie.domain || domain,
      path: cookie.path || '/',
      expires: 0, // Set expiry to epoch time (already expired)
    }]);
    
    return null;
  } catch (err: any) {
    throw new Error(`Failed to delete cookie '${name}': ${err.message}`);
  }
} 