import { BaseDriver } from "@appium/base-driver";
import { fs } from "appium-support";
import * as path from "path";
import type { DriverCaps, DriverOpts, DefaultCreateSessionResult, PlaywrightBrowser } from "./types/index";
import type { W3CDriverCaps, DriverData } from '@appium/types';
import { memoize } from "./utils";
import commands from "./commands";
import { remote } from "webdriverio"; // Import WebDriverIO for Appium integration

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

    if (capabilities.deviceName) {
      // Initialize Appium client for mobile testing
      this.appiumClient = await remote({
        protocol: "http",
        hostname: capabilities.address || "localhost",
        port: capabilities.port || 4723,
        path: "/wd/hub",
        capabilities: {
          platformName: capabilities.platformName,
          "appium:deviceName": capabilities.deviceName,
          "appium:app": capabilities.app,
          "appium:automationName": capabilities.automationName || "UiAutomator2",
        },
      });
    } else {
      // Initialize Playwright for browser testing
      this.playwright = await this.getPlaywright();
      if (!this.playwright) {
        throw new Error("Failed to initialize Playwright");
      }

      const browserType = capabilities.platformName;
      if (!browserType) {
        throw new Error("Browser type is not specified in capabilities");
      }

      this.browser = await this.playwright[browserType].launch({
        headless: capabilities.headless,
      });
    }

    return { sessionId, capabilities };
  }

  public async deleteSession() {
    if (this.appiumClient) {
      await this.appiumClient.deleteSession();
      this.appiumClient = undefined;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }

    this.resetState();
    await super.deleteSession();
  }
}

export default Driver;
