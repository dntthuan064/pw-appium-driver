// Add WebDriver element key definition
declare namespace WebDriver {
  // Element reference key
  const ELEMENT: string;
  
  // W3C WebDriver element reference key  
  const ELEMENT_KEY: string;
}

// Add Playwright specific types
declare module 'playwright' {
  export interface Browser {
    chromium: any;
    firefox: any;
    webkit: any;
    launch(options?: any): Promise<any>;
    close(): Promise<void>;
    contexts(): any[];
    newContext(options?: any): Promise<any>;
  }
  
  export interface BrowserContext {
    close(): Promise<void>;
    newPage(): Promise<any>;
    pages(): any[];
  }
  
  export interface Page {
    close(): Promise<void>;
    url(): Promise<string>;
    title(): Promise<string>;
    content(): Promise<string>;
    evaluate(pageFunction: Function | string, ...args: any[]): Promise<any>;
    evaluateHandle(pageFunction: Function | string, ...args: any[]): Promise<any>;
    goto(url: string, options?: any): Promise<any>;
    reload(options?: any): Promise<any>;
    setViewportSize(viewportSize: { width: number; height: number }): Promise<void>;
    viewportSize(): { width: number; height: number };
    $(selector: string): Promise<any>;
    $$(selector: string): Promise<any[]>;
    screenshot(options?: any): Promise<Buffer>;
    isClosed(): boolean;
  }
  
  export interface ElementHandle {
    evaluate(pageFunction: Function, ...args: any[]): Promise<any>;
    click(options?: any): Promise<void>;
    fill(value: string): Promise<void>;
    type(text: string, options?: any): Promise<void>;
    screenshot(options?: any): Promise<Buffer>;
    isEnabled(): Promise<boolean>;
  }
} 