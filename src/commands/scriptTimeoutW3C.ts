export default async function scriptTimeoutW3C(this: any, ms: number) {
  // Set the script timeout in the driver
  this.timeouts.script = ms;
  
  // Return null as per WebDriver spec
  return null;
} 