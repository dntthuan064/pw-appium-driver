import type {
  Browser as PlaywrightCoreBrowser,
  BrowserContext,
  Page,
} from "playwright-core";
import type { ServerArgs, Capabilities, Constraints } from "@appium/types";

export interface PlaywrightBrowser extends PlaywrightCoreBrowser {}
export interface PlaywrightContext extends BrowserContext {}
export interface PlaywrightPage extends Page {}

// Define a proper Constraint type that matches Appium's requirements
interface Constraint {
  presence?: boolean;
  isString?: boolean;
  inclusion?: readonly [string, ...string[]];
  matches?: RegExp;
  isArray?: boolean;
  isNumber?: boolean;
  isBoolean?: boolean;
}

export interface DriverCapConstraints extends Record<string, Constraint> {
  platformName: Constraint;
  automationName: Constraint;
  deviceName: Constraint;
  app: Constraint;
  browserArgs: Constraint;
  wsEndpoint: Constraint;
  headless: Constraint;
  address: Constraint;
  port: Constraint;
  debug: Constraint;
  connectionTimeout: Constraint;
  maxRetries: Constraint;
  reconnectOnDisconnect: Constraint;
  heartbeatInterval: Constraint;
  healthCheckInterval: Constraint;
  maxFailedChecks: Constraint;
  maxReconnectAttempts: Constraint;
  launchTimeout: Constraint;
}

export interface DriverCaps extends Capabilities<DriverCapConstraints> {
  [key: string]: any;
}

// Make all ServerArgs properties optional
export interface DriverOpts {
  address?: string;
  port?: number;
  path?: string;
  logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "silent";
  allowCors?: boolean;
  allowInsecure?: string[];
  basePath?: string;
  callbackPort?: number;
  defaultCapabilities?: Record<string, any>;
  keepAliveTimeout?: number;
  localTimezone?: boolean;
  logNoColors?: boolean;
  sessionOverride?: boolean;
  useDrivers?: string[];
}

export interface DefaultCreateSessionResult<C extends DriverCaps> {
  sessionId: string;
  capabilities: C;
}

export interface Driver {
  // Element Commands
  findElement(strategy: string, selector: string): Promise<{ ELEMENT: string }>;
  findElements(
    strategy: string,
    selector: string,
  ): Promise<Array<{ ELEMENT: string }>>;
  click(elementId: string): Promise<void>;
  clear(elementId: string): Promise<void>;
  setValue(
    elementId: string,
    value: string,
    options?: { replace?: boolean },
  ): Promise<void>;
  elementDisplayed(elementId: string): Promise<boolean>;
  elementEnabled(elementId: string): Promise<boolean>;
  elementSelected(elementId: string): Promise<boolean>;
  getAttribute(elementId: string, name: string): Promise<string | null>;
  getCssProperty(elementId: string, name: string): Promise<string>;
  getText(elementId: string): Promise<string>;
  getElementRect(
    elementId: string,
  ): Promise<{ x: number; y: number; width: number; height: number }>;

  // Browser Commands
  getScreenshot(): Promise<string>;
  getPageSource(): Promise<string>;
  implicitWaitW3C(ms: number): Promise<void>;
  pageLoadTimeoutW3C(ms: number): Promise<void>;
  scriptTimeoutW3C(ms: number): Promise<void>;
  setUrl(url: string): Promise<void>;
  getUrl(): Promise<string>;
  back(): Promise<void>;
  forward(): Promise<void>;
  refresh(): Promise<void>;
  title(): Promise<string>;

  // Session Commands
  createSession(
    w3cCapabilities1: any,
    w3cCapabilities2?: any,
    w3cCapabilities?: any,
    driverData?: any[],
  ): Promise<DefaultCreateSessionResult<DriverCaps>>;
  deleteSession(): Promise<void>;

  // Mobile Commands
  performActions(actions: any[]): Promise<void>;
  releaseActions(): Promise<void>;

  // Additional properties
  appiumClient?: any;
  browser?: PlaywrightBrowser;
  elementCache: Map<string, any>;
  windows: Record<string, any>;
  currentHandle?: string;
  W3C_ELEMENT_KEY: string;
}
