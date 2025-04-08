export default async function execute(
  this: any,
  script: string,
  args: any[] = [],
) {
  const page = this.windows[this.currentHandle];

  // Map Selenium element references to Playwright element handles
  const mappedArgs = await Promise.all(
    args.map(async (arg) => {
      if (arg && typeof arg === "object" && arg[this.W3C_ELEMENT_KEY]) {
        const elementId = arg[this.W3C_ELEMENT_KEY];
        return this.elementCache.get(elementId);
      }
      return arg;
    }),
  );

  // Execute the script in the browser context
  const result = await page.evaluate(
    (script, args) => {
      // This function runs in the browser
      const fn = new Function("return " + script)();
      return fn.apply(null, args);
    },
    script,
    mappedArgs,
  );

  // Process the result to replace elements with element references
  return result;
}
