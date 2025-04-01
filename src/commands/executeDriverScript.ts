export default async function executeDriverScript(this: any, script: string, args: any[] = []) {
  try {
    // Create a function from the script
    // This is a security risk, but it's part of the WebDriver protocol
    const fn = new Function('driver', 'args', script);
    
    // Execute the function with the driver instance and arguments
    return await fn(this, args);
  } catch (err: any) {
    throw new Error(`Failed to execute driver script: ${err.message}`);
  }
} 