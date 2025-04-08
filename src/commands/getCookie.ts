export default async function getCookie(this: any, name: string) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Get all cookies
    const cookies = await page.context().cookies();

    // Find the cookie with the specified name
    const cookie = cookies.find((c) => c.name === name);

    if (!cookie) {
      throw new Error(`Cookie with name '${name}' not found`);
    }

    return cookie;
  } catch (err: any) {
    throw new Error(`Failed to get cookie '${name}': ${err.message}`);
  }
}
