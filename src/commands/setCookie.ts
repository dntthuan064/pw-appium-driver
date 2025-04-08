export default async function setCookie(this: any, cookie: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Check required cookie fields
    if (!cookie.name || cookie.value === undefined) {
      throw new Error("Cookie must have at least a name and value");
    }

    // Prepare cookie object for Playwright
    const cookieObj = {
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path || "/",
      expires: cookie.expiry ? cookie.expiry : -1,
      httpOnly: cookie.httpOnly || false,
      secure: cookie.secure || false,
      sameSite: cookie.sameSite || "Lax",
    };

    // Set the cookie in the current context
    await page.context().addCookies([cookieObj]);

    return null;
  } catch (err: any) {
    throw new Error(`Failed to set cookie: ${err.message}`);
  }
}
