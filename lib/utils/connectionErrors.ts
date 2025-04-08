export class PlaywrightConnectionError extends Error {
  constructor(
    message: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = "PlaywrightConnectionError";
  }
}

export function isNetworkError(error: Error): boolean {
  const networkErrors = [
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "ERR_CONNECTION_REFUSED",
  ];

  return networkErrors.some((err) => error.message.includes(err));
}

export function handleConnectionError(error: Error): never {
  if (isNetworkError(error)) {
    throw new PlaywrightConnectionError(
      "Network connection failed. Please check if the Playwright server is running and accessible.",
      error,
    );
  }

  throw new PlaywrightConnectionError(
    "Connection failed. Please check your configuration and try again.",
    error,
  );
}
