export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        // Exponential backoff with jitter
        const delay = Math.min(baseDelay * Math.pow(2, i), 10000) 
          + Math.floor(Math.random() * 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
