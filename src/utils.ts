/**
 * Simple memoization function to cache expensive operations
 */
export function memoize<T>(fn: () => Promise<T>): () => Promise<T> {
  let result: T | undefined;
  let promise: Promise<T> | undefined;

  return async () => {
    if (result !== undefined) {
      return result;
    }
    if (!promise) {
      promise = fn().then(r => {
        result = r;
        return r;
      });
    }
    return promise;
  };
}

/**
 * Generate a random ID for elements
 */
export function generateElementId(): string {
  return `element-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert an error to a standardized format
 */
export function formatError(err: Error): Error {
  return err;
} 