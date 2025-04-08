import { BaseDriver } from "@appium/base-driver";
import { fs } from "appium-support";
import * as path from "path";
import type {
  DriverCaps,
  DriverCapConstraints,
  DriverOpts,
  DefaultCreateSessionResult,
  PlaywrightBrowser,
} from "../types";
import type { W3CDriverCaps, DriverData } from "@appium/types";
import { memoize } from "./utils";
import commands from "./commands";
import { remote } from "webdriverio";
import {
  PlaywrightConnectionError,
  isNetworkError,
  handleConnectionError,
} from "../lib/utils/connectionErrors";
import { ConnectivityChecker } from "../lib/utils/connectivity";
import { retry } from "../lib/utils/retry";
import {
  ConnectionMonitor,
  ConnectionState,
} from "../lib/utils/connectionMonitor";

class Driver extends BaseDriver<
  DriverCaps,
  DriverOpts,
  {},
  DefaultCreateSessionResult<DriverCaps>,
  void,
  {}
> {
  static newMethodMap = commands;

  public locatorStrategies = [
    "css selector",
    "tag name",
    "xpath",
    "id",
    "name",
    "accessibility id",
    "class name",
    "link text",
    "partial link text",
    "shadow",
  ];

  public playwright?: typeof import("playwright-core");
  public browser?: PlaywrightBrowser;
  public windows: Record<string, any> = {};
  public currentHandle?: string;
  public elementCache = new Map<string, any>();
  public appiumClient?: any;
  public W3C_ELEMENT_KEY = "ELEMENT";
  private connectionMonitor: ConnectionMonitor;
  private reconnectionInProgress: boolean = false;

  constructor(opts: Partial<DriverOpts> = {}) {
    super(opts as any);
    this.connectionMonitor = ConnectionMonitor.getInstance();
    this.resetState();
  }

  public async click(elementId: string): Promise<void> {
    return commands.click.call(this, elementId);
  }

  public async setValue(elementId: string, value: string): Promise<void> {
    return commands.setValue.call(this, elementId, value);
  }

  public async elementDisplayed(elementId: string): Promise<boolean> {
    return commands.elementDisplayed.call(this, elementId);
  }

  public async getScreenshot(): Promise<string> {
    return commands.getScreenshot.call(this);
  }

  public resetState() {
    this.windows = {};
    this.elementCache = new Map();
    this.currentHandle = undefined;
  }

  public getPlaywright = memoize(async () => {
    try {
      return await import("playwright-core");
    } catch {
      try {
        const requireg = await import("requireg");
        return requireg.default("playwright-core");
      } catch {
        throw new Error(
          `Playwright not found. Please install it via 'npm install playwright-core' or 'yarn add playwright-core'.`,
        );
      }
    }
  });

  public async createSession(
    w3cCapabilities1: W3CDriverCaps<DriverCaps>,
    w3cCapabilities2?: W3CDriverCaps<DriverCaps>,
    w3cCapabilities?: W3CDriverCaps<DriverCaps>,
    driverData?: DriverData[],
  ): Promise<DefaultCreateSessionResult<DriverCaps>> {
    const { sessionId, capabilities } = await super.createSession(
      w3cCapabilities1,
      w3cCapabilities2,
      w3cCapabilities,
      driverData,
    );

    try {
      if (capabilities.deviceName) {
        // Initialize Appium client for mobile testing with retry
        try {
          this.appiumClient = await retry(
            async () => {
              return await remote({
                protocol: "http",
                hostname: String(capabilities.address || "localhost"),
                port: Number(capabilities.port || 4723),
                path: "/wd/hub",
                connectionRetryTimeout: 30000,
                connectionRetryCount: 3,
                capabilities: {
                  platformName: String(capabilities.platformName),
                  "appium:deviceName": String(capabilities.deviceName),
                  "appium:app": String(capabilities.app),
                  "appium:automationName": String(
                    capabilities.automationName || "UiAutomator2",
                  ),
                } as any,
              });
            },
            3,
            2000,
          );

          // Start monitoring Appium connection with enhanced options
          await this.connectionMonitor.monitorConnection(
            sessionId,
            this.appiumClient,
            {
              healthCheckInterval: Number(
                capabilities.healthCheckInterval || 30000,
              ),
              maxFailedChecks: Number(capabilities.maxFailedChecks || 3),
              maxReconnectAttempts: Number(
                capabilities.maxReconnectAttempts || 5,
              ),
            },
          );
        } catch (err) {
          const error = err as Error;
          if (isNetworkError(error)) {
            throw new PlaywrightConnectionError(
              `Failed to connect to Appium server. Please check if the server is running and accessible.`,
              error,
            );
          }
          handleConnectionError(error);
        }
      } else {
        // Initialize Playwright for browser testing
        try {
          const browserType = String(capabilities.platformName);
          if (!browserType) {
            throw new Error("platformName capability is required");
          }

          // Check if we should use WebSocket endpoint
          if (capabilities.wsEndpoint) {
            try {
              this.browser = await ConnectivityChecker.establishConnection(
                String(capabilities.wsEndpoint),
                {
                  maxRetries: Number(capabilities.maxRetries || 3),
                  timeoutMs: Number(capabilities.connectionTimeout || 30000),
                  debug: Boolean(capabilities.debug || false),
                  reconnectOnDisconnect:
                    capabilities.reconnectOnDisconnect !== false,
                  heartbeatInterval: Number(
                    capabilities.heartbeatInterval || 30000,
                  ),
                },
              );
            } catch (err) {
              const error = err as Error;
              throw new PlaywrightConnectionError(
                `Failed to connect to browser via WebSocket: ${error.message}`,
                error,
              );
            }
          } else {
            // Regular browser launch with retry
            this.browser = await retry(
              async () => {
                return await this.initPlaywright(browserType, capabilities);
              },
              3,
              2000,
            );
          }

          // Start monitoring browser connection with enhanced options
          if (this.browser) {
            await this.connectionMonitor.monitorConnection(
              sessionId,
              this.browser,
              {
                healthCheckInterval: Number(
                  capabilities.healthCheckInterval || 30000,
                ),
                maxFailedChecks: Number(capabilities.maxFailedChecks || 3),
                maxReconnectAttempts: Number(
                  capabilities.maxReconnectAttempts || 5,
                ),
              },
            );
          }
        } catch (err) {
          const error = err as Error;
          if (isNetworkError(error)) {
            throw new PlaywrightConnectionError(
              "Failed to initialize connection. Please check your network connection.",
              error,
            );
          }
          handleConnectionError(error);
        }
      }

      return { sessionId, capabilities };
    } catch (error) {
      await this.deleteSession();
      const err = error as Error;
      if (err instanceof PlaywrightConnectionError) {
        throw err;
      }
      handleConnectionError(err);
    }
  }

  public async deleteSession() {
    const wasConnected =
      this.sessionId && this.connectionMonitor.isConnected(this.sessionId);

    if (this.sessionId) {
      this.connectionMonitor.stopMonitoring(this.sessionId);
    }

    if (this.appiumClient) {
      try {
        await this.appiumClient.deleteSession();
      } catch (err) {
        // Log but don't throw to ensure cleanup continues
        console.error("Error deleting Appium session:", err);
      }
      this.appiumClient = undefined;
    }

    if (this.browser) {
      try {
        await this.browser.close();
      } catch (err) {
        // Log but don't throw to ensure cleanup continues
        console.error("Error closing browser:", err);
      }
      this.browser = undefined;
    }

    this.resetState();
    await super.deleteSession();

    // Notify if session was previously connected
    if (wasConnected) {
      console.log("Session successfully cleaned up and closed");
    }
  }

  public isSessionActive(): boolean {
    if (!this.sessionId) {
      return false;
    }
    return (
      !this.reconnectionInProgress &&
      this.connectionMonitor.getConnectionState(this.sessionId) ===
        ConnectionState.CONNECTED
    );
  }

  private async initPlaywright(browserType: string, capabilities: DriverCaps) {
    this.playwright = await this.getPlaywright();
    if (!this.playwright) {
      throw new PlaywrightConnectionError("Failed to initialize Playwright");
    }

    // Type-safe browser selection
    const supportedBrowsers = ["chromium", "firefox", "webkit"] as const;
    type SupportedBrowser = (typeof supportedBrowsers)[number];

    if (!supportedBrowsers.includes(browserType as SupportedBrowser)) {
      throw new Error(
        `Unsupported browser type: ${browserType}. Must be one of: ${supportedBrowsers.join(", ")}`,
      );
    }

    // We know browserType is valid at this point
    const browser = browserType as SupportedBrowser;

    return await this.playwright[browser].launch({
      headless: capabilities.headless !== false,
      args: Array.isArray(capabilities.browserArgs)
        ? capabilities.browserArgs
        : [],
      timeout: Number(capabilities.launchTimeout || 30000),
    });
  }
}

export default Driver;
