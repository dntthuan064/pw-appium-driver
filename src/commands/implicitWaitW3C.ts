export default async function implicitWaitW3C(this: any, ms: number) {
  // Set the implicit wait timeout in the driver
  this.timeouts.implicit = ms;
  
  // Return null as per WebDriver spec
  return null;
} 