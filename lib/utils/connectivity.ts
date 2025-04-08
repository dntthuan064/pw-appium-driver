import { Browser, chromium as playwrightChromium } from "playwright-core";
import { retry } from "./retry";
import { PlaywrightConnectionError } from "./connectionErrors";
import { EventEmitter } from "events";

export class ConnectivityChecker {
  static async validateWebSocketEndpoint(endpoint: string): Promise<boolean> {
    const wsRegex = /^ws:\/\/.+:\d+\/.*$/;
    if (!wsRegex.test(endpoint)) {
      throw new PlaywrightConnectionError(
        `Invalid WebSocket endpoint format: ${endpoint}`,
      );
    }
    return true;
  }

  static async createBrowserConnection(options: {
    wsEndpoint?: string;
    browserType?: string;
    launchOptions?: any;
  }): Promise<Browser> {
    try {
      if (options.wsEndpoint) {
        return await playwrightChromium.connect({
          wsEndpoint: options.wsEndpoint,
          timeout: options.launchOptions?.timeout || 30000,
          headers: {
            "x-appium-request": "true",
          },
        });
      } else {
        const browserType = options.browserType || "chromium";
        return await (playwrightChromium as any)[browserType].launch(
          options.launchOptions || {},
        );
      }
    } catch (err) {
      const error = err as Error;
      throw new PlaywrightConnectionError(
        `Failed to establish browser connection: ${error.message}`,
        error,
      );
    }
  }

  static async establishConnection(
    browserWSEndpoint: string,
    options = {
      maxRetries: 3,
      timeoutMs: 30000,
      debug: false,
      reconnectOnDisconnect: true,
      heartbeatInterval: 30000,
    },
  ): Promise<Browser> {
    await this.validateWebSocketEndpoint(browserWSEndpoint);

    try {
      const browser = await retry(
        async () => {
          if (options.debug) {
            console.log(`Attempting to connect to ${browserWSEndpoint}`);
          }

          const browser = await this.createBrowserConnection({
            wsEndpoint: browserWSEndpoint,
            launchOptions: {
              timeout: options.timeoutMs,
            },
          });

          // Validate browser connection
          const contexts = await browser.contexts();
          const pages = contexts.length > 0 ? await contexts[0].pages() : [];
          if (pages.length === 0) {
            throw new PlaywrightConnectionError(
              "Browser connected but no pages available",
            );
          }

          // Use a custom event emitter for disconnect events since Browser doesn't implement EventEmitter
          const emitter = new EventEmitter();
          const browserWithEvents = Object.assign(browser, emitter);

          if (options.reconnectOnDisconnect) {
            const checkDisconnect = setInterval(async () => {
              try {
                await browser.contexts();
              } catch (err) {
                clearInterval(checkDisconnect);
                browserWithEvents.emit("disconnected");
              }
            }, 1000);

            browserWithEvents.on("disconnected", async () => {
              if (options.debug) {
                console.log("Browser disconnected, attempting to reconnect...");
              }
              try {
                await this.establishConnection(browserWSEndpoint, options);
              } catch (err) {
                const error = err as Error;
                console.error("Failed to reconnect:", error.message);
              }
            });

            // Clean up interval on browser close
            const originalClose = browser.close.bind(browser);
            browser.close = async () => {
              clearInterval(checkDisconnect);
              await originalClose();
            };
          }

          // Setup heartbeat to keep connection alive
          if (options.heartbeatInterval > 0) {
            const heartbeat = setInterval(async () => {
              try {
                await browser.contexts(); // Light operation to check connection
              } catch (err) {
                const error = err as Error;
                if (options.debug) {
                  console.log("Heartbeat failed:", error.message);
                }
                clearInterval(heartbeat);
              }
            }, options.heartbeatInterval);

            // Clean up heartbeat on browser close
            const originalClose = browser.close.bind(browser);
            browser.close = async () => {
              clearInterval(heartbeat);
              await originalClose();
            };
          }

          return browserWithEvents;
        },
        options.maxRetries,
        Math.floor(options.timeoutMs / options.maxRetries),
      );

      return browser;
    } catch (err) {
      const error = err as Error;
      throw new PlaywrightConnectionError(
        `Failed to establish connection: ${error.message}`,
        error,
      );
    }
  }
}
