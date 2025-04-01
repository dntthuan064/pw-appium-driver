import type { Browser, BrowserContext, Page } from 'playwright';
import type { ServerArgs, Capabilities, Constraints } from '@appium/types';

export type PlaywrightBrowser = Browser;
export type PlaywrightContext = BrowserContext;
export type PlaywrightPage = Page;

export interface DriverCaps extends Capabilities<Constraints> {
  platformName: 'chromium' | 'firefox' | 'webkit' | 'android' | 'ios';
  headless?: boolean;
  deviceName?: string; // Mobile device name
  app?: string; // Path to the mobile app
  automationName?: string; // Automation engine for mobile testing
  [key: string]: any;
}

export interface DriverOpts extends ServerArgs {
  defaultCapabilities: DriverCaps;
}

export interface DefaultCreateSessionResult<C extends DriverCaps> {
  sessionId: string;
  capabilities: C;
}