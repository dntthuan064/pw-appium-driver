# Playwright Driver

Playwright Driver is a W3C WebDriver that allows you to use Playwright through any WebDriver client. It supports both browser automation and mobile web testing through Appium.

## Features

- Full W3C WebDriver protocol implementation
- Support for Chromium, Firefox, and WebKit browsers
- Built-in connection monitoring and auto-recovery
- Mobile web testing support through Appium integration
- Viewport emulation and device simulation
- Browser DevTools protocol access
- Support for browser-specific capabilities

## Installation

```bash
npm install # or yarn install
appium driver install --source local "$(pwd)"
```

Output:
```
Driver playwright@<version> successfully installed
  - automationName: Playwright
  - platformNames: ["chromium","firefox","webkit"]
```

Run Appium:

```bash
appium server
```

Output:
```
Appium REST http interface listener started on 0.0.0.0:4723
Available drivers:
  - playwright@<version> (automationName 'Playwright')
```

## Capabilities

### Appium Capabilities

| Capability | Required | Type | Description |
| --- | --- | --- | --- |
| appium:automationName | + | string | Must be playwright |

### W3C Capabilities

| Capability | Required | Type | Description |
| --- | --- | --- | --- |
| platformName | + | string | Must be chromium, firefox or webkit |
| acceptInsecureCerts | - | boolean | Indicates whether untrusted and self-signed TLS certificates are implicitly trusted on navigation |
| pageLoadStrategy | - | string | Defines the current session's page load strategy<br />Besides the standard values, it also supports networkidle |
| timeouts | - | object | |
| timeouts.script | - | number | Defines the current session's script timeout |
| timeouts.pageLoad | - | number | Defines the current session's page load timeout |
| timeouts.implicit | - | number | Defines the current session's implicit wait timeout |
| unhandledPromptBehavior | - | string | Defines the current session's user prompt handler |
| proxy | - | object | |
| proxy.proxyType | - | string | |
| proxy.proxyAuthenticator | - | string | |
| proxy.httpProxy | - | string | |
| proxy.sslProxy | - | string | |
| proxy.ftpProxy | - | string | |
| proxy.socksProxy | - | string | |
| proxy.socksVersion | - | string | |
| proxy.noProxy | - | string | |
| webSocketUrl | - | boolean | Indicates if a WebSocket URL should be reported as capability |
| strictFileInteractability | - | boolean | |
| appium:orientation | - | string | Must be landscape or portrait |
| appium:networkConnection | - | number | |
| appium:newCommandTimeout | - | number | How long (in seconds) Appium will wait for a new command |
| appium:autoLaunch | - | boolean | Whether to instruct Playwright to launch browser automatically<br />If set to false, means that client will handle browser creation<br />And it is expected that Playwright remote endpoint or browser websocket url will be passed |
| appium:browserName | - | string | Ignored if platformName is specified |
| appium:headless | - | boolean | Whether the browser will be launched in headless mode |
| appium:browserArgs | - | array | Additional command line arguments to pass to browser instance |
| appium:userDataDir | - | string | User data dir for Chromium or Firefox |
| appium:collectDevToolsLogs | - | boolean | If enabled, collects DevTools protocol logs from Chrome |
| appium:goog:chromeOptions | - | object | Chrome-specific capability |
| appium:moz:firefoxOptions | - | object | Firefox-specific capability |
| appium:ms:edgeOptions | - | object | Edge-specific capability |
| appium:browserVersion | - | string | Allows to select specific browser version |
| appium:channel | - | string | Allows to select various browser channels |
| appium:colorScheme | - | string | Emulates 'prefers-colors-scheme' media feature, supported values: 'light', 'dark', 'no-preference' |
| appium:deviceScaleFactor | - | number | Specify device scale factor, defaults to 1 |
| appium:viewport | - | object | Emulated viewport |
| appium:width | - | number | Width of the screen in pixels |
| appium:height | - | number | Height of the screen in pixels |
| appium:wsEndpoint | - | string | Browser websocket endpoint to connect to |
| appium:recordHar | - | object | |
| appium:recordVideo | - | object | Allows capturing of the page |
| appium:extraHTTPHeaders | - | object | An object containing additional HTTP headers |
| appium:ignoreHTTPSErrors | - | boolean | Whether to ignore HTTPS errors |
| appium:bypassCSP | - | boolean | Bypasses Content-Security-Policy |
| appium:defaultBrowserType | - | string | Allows to select a specific browser when platformName is set to android or ios |
| appium:reconnectOnDisconnect | - | boolean | Whether to attempt reconnection on connection loss |
| appium:heartbeatInterval | - | number | Interval for connection health checks in milliseconds |
| appium:connectionTimeout | - | number | Timeout for connection attempts in milliseconds |
| appium:maxRetries | - | number | Maximum number of connection retry attempts |
| appium:healthCheckInterval | - | number | Interval between health checks in milliseconds |
| appium:maxFailedChecks | - | number | Maximum number of failed health checks before recovery |
| appium:maxReconnectAttempts | - | number | Maximum number of reconnection attempts |

## Connection Monitoring

The driver includes built-in connection monitoring and recovery features:

- Automatic connection health checking
- Connection loss detection and recovery
- Configurable retry attempts and intervals
- Session state preservation during reconnection
- Graceful session cleanup on unrecoverable failures

## Commands

| Command | Reference |  Description |
| --- | --- | --- |
| [active](src/commands/active.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-active-element) | Get Active Element |
| [back](src/commands/back.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-back) | Back |
| [clear](src/commands/clear.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-element-clear) | Element Clear |
| [click](src/commands/click.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-element-click) | Element Click |
| [closeWindow](src/commands/window/closeWindow.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-close-window) | Close Window |
| [createSession](src/commands/session/createSession.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-new-sessions) | New Session |
| [createWindow](src/commands/window/createWindow.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-new-window) | New Window |
| [deleteCookie](src/commands/deleteCookie.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-delete-cookie) | Delete Cookie |
| [deleteCookies](src/commands/deleteCookies.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-delete-all-cookies) | Delete All Cookies |
| [deleteSession](src/commands/session/deleteSession.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-delete-session) | Delete Session |
| [elementDisplayed](src/commands/elementDisplayed.ts) | [here](https://www.w3.org/TR/webdriver/#element-displayedness) | Is Element Displayed |
| [elementEnabled](src/commands/elementEnabled.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-is-element-enabled) | Is Element Enabled |
| [elementSelected](src/commands/elementSelected.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-is-element-selected) | Is Element Selected |
| [executeDriverScript](src/commands/executeDriverScript.ts) | - | Execute Driver Script |
| [execute](src/commands/execute.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-execute-script) | Execute Script |
| [executeAsync](src/commands/executeAsync.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-execute-async-script) | Execute Async Script |
| [findElement](src/commands/element/findElement.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-find-element) | Find Element |
| [findElementFromElement](src/commands/element/findElementFromElement.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-find-element-from-element) | Find Element From Element |
| [findElementFromShadowRoot](src/commands/element/findElementFromShadowRoot.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-find-element-from-shadow-root) | Find Element From Shadow Root |
| [findElements](src/commands/element/findElements.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-find-elements) | Find Elements |
| [findElementsFromElement](src/commands/element/findElementsFromElement.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-find-elements-from-element) | Find Elements From Element |
| [findElementsFromShadowRoot](src/commands/element/findElementsFromShadowRoot.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-find-elements-from-shadow-root) | Find Elements From Shadow Root |
| [forward](src/commands/forward.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-forward) | Forward |
| [fullScreenWindow](src/commands/window/fullScreenWindow.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-fullscreen-window) | Fullscreen Window |
| [getAlertText](src/commands/getAlertText.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-alert-text) | Get Alert Text |
| [getAttribute](src/commands/getAttribute.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-element-attribute) | Get Element Attribute |
| [getComputedLabel](src/commands/getComputedLabel.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-computed-label) | Get Computed Label |
| [getComputedRole](src/commands/getComputedRole.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-computed-role) | Get Computed Role |
| [getCookie](src/commands/getCookie.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-named-cookie) | Get Named Cookie |
| [getCookies](src/commands/getCookies.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-all-cookies) | Get All Cookies |
| [getCssProperty](src/commands/getCssProperty.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-element-css-value) | Get Element CSS Value |
| [getElementRect](src/commands/element/getElementRect.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-element-rect) | Get Element Rect |
| [getElementScreenshot](src/commands/element/getElementScreenshot.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-take-element-screenshot) | Take Element Screenshot |
| [getName](src/commands/getName.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-element-tag-name) | Get Element Tag Name |
| [getPageSource](src/commands/getPageSource.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-page-source) | Get Page Source |
| [getProperty](src/commands/getProperty.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-element-property) | Get Element Property |
| [getScreenshot](src/commands/getScreenshot.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-take-screenshot) | Take Screenshot |
| [getText](src/commands/getText.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-element-text) | Get Element Text |
| [getTimeouts](src/commands/getTimeouts.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-timeouts) | Get Timeouts |
| [getUrl](src/commands/getUrl.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-current-url) | Get Current URL |
| [getWindowHandle](src/commands/window/getWindowHandle.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-window-handle) | Get Window Handle |
| [getWindowHandles](src/commands/window/getWindowHandles.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-window-handles) | Get Window Handles |
| [getWindowRect](src/commands/window/getWindowRect.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-window-rect) | Get Window Rect |
| [implicitWaitW3C](src/commands/implicitWaitW3C.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-set-timeouts) | Set Implicit Timeout |
| [maximizeWindow](src/commands/window/maximizeWindow.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-maximize-window) | Maximize Window |
| [minimizeWindow](src/commands/window/minimizeWindow.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-minimize-window) | Minimize Window |
| [pageLoadTimeoutW3C](src/commands/pageLoadTimeoutW3C.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-set-timeouts) | Set Page Load Timeout |
| [parentFrame](src/commands/parentFrame.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-switch-to-parent-frame) | Switch To Parent Frame |
| [performActions](src/commands/performActions.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-perform-actions) | Perform Actions |
| [postAcceptAlert](src/commands/postAcceptAlert.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-accept-alert) | Accept Alert |
| [postDismissAlert](src/commands/postDismissAlert.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-dismiss-alert) | Dismiss Alert |
| [printPage](src/commands/printPage.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-print-page) | Print Page |
| [refresh](src/commands/refresh.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-refresh) | Refresh |
| [releaseActions](src/commands/releaseActions.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-release-actions) | Release Actions |
| [scriptTimeoutW3C](src/commands/scriptTimeoutW3C.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-set-timeouts) | Set Script Timeout |
| [setAlertText](src/commands/setAlertText.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-send-alert-text) | Send Alert Text |
| [setCookie](src/commands/setCookie.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-adding-a-cookie) | Add Cookie |
| [setFrame](src/commands/setFrame.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-switch-to-frame) | Switch To Frame |
| [setUrl](src/commands/setUrl.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-navigate-to) | Navigate To |
| [setValue](src/commands/setValue.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-element-send-keys) | Element Send Keys |
| [setWindow](src/commands/window/setWindow.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-switch-to-window) | Switch To Window |
| [setWindowRect](src/commands/window/setWindowRect.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-set-window-rect) | Set Window Rect |
| [title](src/commands/title.ts) | [here](https://www.w3.org/TR/webdriver/#dfn-get-title) | Get Title |
| [uploadFile](src/commands/uploadFile.ts) | - | Upload File |