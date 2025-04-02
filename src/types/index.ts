import type { Browser as PlaywrightCoreBrowser, BrowserContext, Page } from 'playwright-core';
import type { ServerArgs, Capabilities, Constraints } from '@appium/types';

export interface PlaywrightBrowser extends PlaywrightCoreBrowser {
  close(): Promise<void>;
  contexts(): BrowserContext[];
  newContext(options?: Record<string, any>): Promise<BrowserContext>;
}

export interface PlaywrightContext extends BrowserContext {
  close(): Promise<void>;
  newPage(): Promise<Page>;
  pages(): Page[];
}

// Instead of extending Page, we define our own interface
export interface PlaywrightPage {
  close(): Promise<void>;
  frames(): any[];
  url(): Promise<string>;
  title(): Promise<string>;
  content(): Promise<string>;
  goto(url: string, options?: Record<string, any>): Promise<any>;
  evaluate<T>(pageFunction: Function | string, ...args: any[]): Promise<T>;
  evaluateHandle(pageFunction: Function | string, ...args: any[]): Promise<any>;
  $(selector: string): Promise<any>;
  $$(selector: string): Promise<any[]>;
  waitForSelector(selector: string, options?: Record<string, any>): Promise<any>;
  setDefaultTimeout(timeout: number): Promise<void>;
  setDefaultNavigationTimeout(timeout: number): Promise<void>;
}

export interface DriverCaps extends Capabilities<Constraints> {
  platformName: 'chromium' | 'firefox' | 'webkit' | 'android' | 'ios';
  headless?: boolean;
  deviceName?: string;
  app?: string;
  automationName?: string;
  wsEndpoint?: string;
  debug?: boolean;
  reconnectOnDisconnect?: boolean;
  heartbeatInterval?: number;
  connectionTimeout?: number;
  maxRetries?: number;
  healthCheckInterval?: number;
  maxFailedChecks?: number;
  maxReconnectAttempts?: number;
  browserArgs?: string[];
  launchTimeout?: number;
  [key: string]: any;
}

export interface DriverOpts extends ServerArgs {
  defaultCapabilities: DriverCaps;
}

export interface DefaultCreateSessionResult<C extends DriverCaps> {
  sessionId: string;
  capabilities: C;
}