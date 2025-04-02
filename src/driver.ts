import { BaseDriver } from "@appium/base-driver";
import { fs } from "appium-support";
import * as path from "path";
import type { DriverCaps, DriverOpts, DefaultCreateSessionResult, PlaywrightBrowser } from "./types/index";
import type { W3CDriverCaps, DriverData } from '@appium/types';
import { memoize } from "./utils";
import commands from "./commands";
import { remote } from "webdriverio";
import { PlaywrightConnectionError, isNetworkError, handleConnectionError } from "../lib/utils/connectionErrors";
import { ConnectivityChecker } from "../lib/utils/connectivity";
import { retry } from "../lib/utils/retry";
import { ConnectionMonitor, ConnectionState } from "../lib/utils/connectionMonitor";

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

  public playwright?: typeof import("playwright");
  public browser?: PlaywrightBrowser;
  public windows: Record<string, any> = {};
  public currentHandle?: string;
  public elementCache = new Map<string, any>();
  public appiumClient?: any; // Add Appium client for mobile testing
  private connectionMonitor: ConnectionMonitor;
  private reconnectionInProgress: boolean = false;

  constructor(opts: Partial<DriverOpts> = {}) {
    const defaultOpts: DriverOpts = {
      address: '0.0.0.0',
      allowCors: false,
      allowInsecure: [],
      basePath: '',
      callbackAddress: undefined,
      callbackPort: 4723,
      debugLogSpacing: false,
      defaultCapabilities: {
        platformName: 'chromium',
        headless: false
      },
      denyInsecure: [],
      driver: {},
      driversImportChunkSize: 3,
      keepAliveTimeout: 600,
      localTimezone: false,
      logFile: undefined,
      logFilters: [],
      logFormat: 'text',
      loglevel: 'debug',
      logNoColors: false,
      logTimestamp: false,
      longStacktrace: false,
      noPermsCheck: false,
      nodeconfig: undefined,
      plugin: undefined,
      pluginsImportChunkSize: 7,
      port: 4723,
      relaxedSecurityEnabled: false,
      requestTimeout: 3600,
      sessionOverride: false,
      shutdownTimeout: 5000,
      sslCertificatePath: undefined,
      sslKeyPath: undefined,
      strictCaps: false,
      tmpDir: undefined,
      traceDir: undefined,
      useDrivers: [],
      usePlugins: [],
      webhook: undefined
    };

    super({ ...defaultOpts, ...opts });
    this.resetState();
    this.connectionMonitor = ConnectionMonitor.getInstance();
    
    // Set up connection event handlers
    this.connectionMonitor.on('connectionLost', this.handleConnectionLost.bind(this));
    this.connectionMonitor.on('connectionRestored', this.handleConnectionRestored.bind(this));
    this.connectionMonitor.on('reconnecting', this.handleReconnecting.bind(this));
    this.connectionMonitor.on('recoveryFailed', this.handleRecoveryFailed.bind(this));
    this.connectionMonitor.on('maxReconnectAttemptsExceeded', this.handleMaxReconnectExceeded.bind(this));
  }

  private async handleConnectionLost(sessionId: string, error: Error): Promise<void> {
    if (sessionId === this.sessionId) {
      console.error(`Connection lost for session ${sessionId}: ${error.message}`);
      // Additional cleanup if needed
    }
  }

  private async handleConnectionRestored(sessionId: string): Promise<void> {
    if (sessionId === this.sessionId) {
      console.log(`Connection restored for session ${sessionId}`);
      this.reconnectionInProgress = false;
      // Reinitialize any necessary state
    }
  }

  private async handleReconnecting(sessionId: string, attempt: number): Promise<void> {
    if (sessionId === this.sessionId) {
      console.log(`Reconnection attempt ${attempt} for session ${sessionId}`);
      this.reconnectionInProgress = true;
    }
  }

  private async handleRecoveryFailed(sessionId: string, error: Error): Promise<void> {
    if (sessionId === this.sessionId) {
      console.error(`Recovery failed for session ${sessionId}: ${error.message}`);
      // Attempt alternative recovery strategies if available
    }
  }

  private async handleMaxReconnectExceeded(sessionId: string): Promise<void> {
    if (sessionId === this.sessionId) {
      console.error(`Max reconnection attempts exceeded for session ${sessionId}`);
      await this.deleteSession();
    }
  }

  public resetState() {
    this.windows = {};
    this.elementCache = new Map();
    this.currentHandle = undefined;
  }

  public getPlaywright = memoize(async () => {
    try {
      return await import("playwright");
    } catch {
      try {
        const requireg = await import("requireg");
        return requireg.default("playwright");
      } catch {
        throw new Error(
          `Playwright not found. Please install it via 'npm install playwright' or 'yarn add playwright'.`
        );
      }
    }
  });

  public async createSession(
    w3cCapabilities1: W3CDriverCaps<DriverCaps>,
    w3cCapabilities2?: W3CDriverCaps<DriverCaps>,
    w3cCapabilities?: W3CDriverCaps<DriverCaps>,
    driverData?: DriverData[]
  ): Promise<DefaultCreateSessionResult<DriverCaps>> {
    const { sessionId, capabilities } = await super.createSession(
      w3cCapabilities1,
      w3cCapabilities2,
      w3cCapabilities,
      driverData
    );

    try {
      if (capabilities.deviceName) {
        // Initialize Appium client for mobile testing with retry
        try {
          this.appiumClient = await retry(
            async () => {
              return await remote({
                protocol: "http",
                hostname: capabilities.address || "localhost",
                port: capabilities.port || 4723,
                path: "/wd/hub",
                connectionRetryTimeout: 30000,
                connectionRetryCount: 3,
                capabilities: {
                  platformName: capabilities.platformName,
                  "appium:deviceName": capabilities.deviceName,
                  "appium:app": capabilities.app,
                  "appium:automationName": capabilities.automationName || "UiAutomator2",
                },
              });
            },
            3,
            2000
          );

          // Start monitoring Appium connection with enhanced options
          await this.connectionMonitor.monitorConnection(sessionId, this.appiumClient, {
            healthCheckInterval: capabilities.healthCheckInterval || 30000,
            maxFailedChecks: capabilities.maxFailedChecks || 3,
            maxReconnectAttempts: capabilities.maxReconnectAttempts || 5
          });

        } catch (err) {
          const error = err as Error;
          if (isNetworkError(error)) {
            throw new PlaywrightConnectionError(
              `Failed to connect to Appium server. Please check if the server is running and accessible.`,
              error
            );
          }
          handleConnectionError(error);
        }
      } else {
        // Initialize Playwright for browser testing
        try {
          this.playwright = await this.getPlaywright();
          if (!this.playwright) {
            throw new PlaywrightConnectionError("Failed to initialize Playwright");
          }

          const browserType = capabilities.platformName;
          if (!browserType) {
            throw new Error("platformName capability is required");
          }

          // Check if we should use WebSocket endpoint
          if (capabilities.wsEndpoint) {
            try {
              this.browser = await ConnectivityChecker.establishConnection(
                capabilities.wsEndpoint,
                {
                  maxRetries: capabilities.maxRetries || 3,
                  timeoutMs: capabilities.connectionTimeout || 30000,
                  debug: capabilities.debug || false,
                  reconnectOnDisconnect: capabilities.reconnectOnDisconnect !== false,
                  heartbeatInterval: capabilities.heartbeatInterval || 30000
                }
              );
            } catch (err) {
              const error = err as Error;
              throw new PlaywrightConnectionError(
                `Failed to connect to browser via WebSocket: ${error.message}`,
                error
              );
            }
          } else {
            // Regular browser launch with retry
            this.browser = await retry(
              async () => {
                return await this.playwright![browserType].launch({
                  headless: capabilities.headless !== false,
                  args: capabilities.browserArgs || [],
                  timeout: capabilities.launchTimeout || 30000
                });
              },
              3,
              2000
            );
          }

          // Start monitoring browser connection with enhanced options
          if (this.browser) {
            await this.connectionMonitor.monitorConnection(sessionId, this.browser, {
              healthCheckInterval: capabilities.healthCheckInterval || 30000,
              maxFailedChecks: capabilities.maxFailedChecks || 3,
              maxReconnectAttempts: capabilities.maxReconnectAttempts || 5
            });
          }
        } catch (err) {
          const error = err as Error;
          if (isNetworkError(error)) {
            throw new PlaywrightConnectionError(
              'Failed to initialize connection. Please check your network connection.',
              error
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
    const wasConnected = this.sessionId && this.connectionMonitor.isConnected(this.sessionId);
    
    if (this.sessionId) {
      this.connectionMonitor.stopMonitoring(this.sessionId);
    }
    
    if (this.appiumClient) {
      try {
        await this.appiumClient.deleteSession();
      } catch (err) {
        // Log but don't throw to ensure cleanup continues
        console.error('Error deleting Appium session:', err);
      }
      this.appiumClient = undefined;
    }

    if (this.browser) {
      try {
        await this.browser.close();
      } catch (err) {
        // Log but don't throw to ensure cleanup continues
        console.error('Error closing browser:', err);
      }
      this.browser = undefined;
    }

    this.resetState();
    await super.deleteSession();

    // Notify if session was previously connected
    if (wasConnected) {
      console.log('Session successfully cleaned up and closed');
    }
  }

  public isSessionActive(): boolean {
    if (!this.sessionId) {
      return false;
    }
    return !this.reconnectionInProgress && 
           this.connectionMonitor.getConnectionState(this.sessionId) === ConnectionState.CONNECTED;
  }
}

export default Driver;
