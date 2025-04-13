export interface PlaywrightBrowser {
  close(): Promise<void>;
  contexts(): any[];
  newContext(options?: Record<string, any>): Promise<any>;
  [key: string]: any;
}

export interface PlaywrightContext {
  close(): Promise<void>;
  newPage(): Promise<any>;
  pages(): any[];
  [key: string]: any;
}

export interface PlaywrightPage {
  close(): Promise<void>;
  frames(): any[];
  url(): Promise<string>;
  title(): Promise<string>;
  content(): Promise<string>;
  goto(url: string, options?: Record<string, any>): Promise<any>;
  [key: string]: any;
}

export interface PlaywrightFrame {
  [key: string]: any;
}

export interface PlaywrightElementHandle {
  [key: string]: any;
}

export interface PlaywrightError extends Error {
  name: string;
}
