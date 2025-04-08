import active from "./active";
import back from "./back";
import clear from "./clear";
import click from "./click";
import closeWindow from "./window/closeWindow";
import createSession from "./session/createSession";
import createWindow from "./window/createWindow";
import deleteCookie from "./deleteCookie";
import deleteCookies from "./deleteCookies";
import deleteSession from "./session/deleteSession";
import elementDisplayed from "./elementDisplayed";
import elementEnabled from "./elementEnabled";
import elementSelected from "./elementSelected";
import executeDriverScript from "./executeDriverScript";
import execute from "./execute";
import executeAsync from "./executeAsync";
import findElement from "./element/findElement";
import findElementFromElement from "./element/findElementFromElement";
import findElementFromShadowRoot from "./element/findElementFromShadowRoot";
import findElements from "./element/findElements";
import findElementsFromElement from "./element/findElementsFromElement";
import findElementsFromShadowRoot from "./element/findElementsFromShadowRoot";
import forward from "./forward";
import fullScreenWindow from "./window/fullScreenWindow";
import getAlertText from "./getAlertText";
import getAttribute from "./getAttribute";
import getComputedLabel from "./getComputedLabel";
import getComputedRole from "./getComputedRole";
import getCookie from "./getCookie";
import getCookies from "./getCookies";
import getCssProperty from "./getCssProperty";
import getElementRect from "./element/getElementRect";
import getElementScreenshot from "./element/getElementScreenshot";
import getName from "./getName";
import getPageSource from "./getPageSource";
import getProperty from "./getProperty";
import getScreenshot from "./getScreenshot";
import getText from "./getText";
import getTimeouts from "./getTimeouts";
import getUrl from "./getUrl";
import getWindowHandle from "./window/getWindowHandle";
import getWindowHandles from "./window/getWindowHandles";
import getWindowRect from "./window/getWindowRect";
import implicitWaitW3C from "./implicitWaitW3C";
import maximizeWindow from "./window/maximizeWindow";
import minimizeWindow from "./window/minimizeWindow";
import pageLoadTimeoutW3C from "./pageLoadTimeoutW3C";
import parentFrame from "./parentFrame";
import performActions from "./performActions";
import postAcceptAlert from "./postAcceptAlert";
import postDismissAlert from "./postDismissAlert";
import printPage from "./printPage";
import refresh from "./refresh";
import releaseActions from "./releaseActions";
import scriptTimeoutW3C from "./scriptTimeoutW3C";
import setAlertText from "./setAlertText";
import setCookie from "./setCookie";
import setFrame from "./setFrame";
import setUrl from "./setUrl";
import setValue from "./setValue";
import setWindow from "./window/setWindow";
import setWindowRect from "./window/setWindowRect";
import title from "./title";
import uploadFile from "./uploadFile";

export * from "./mobile/gestures";
export * from "./mobile/geolocation";
export * from "./mobile/orientation";

// Extension commands can be added here

export default {
  active,
  back,
  clear,
  click,
  closeWindow,
  createSession,
  createWindow,
  deleteCookie,
  deleteCookies,
  deleteSession,
  elementDisplayed,
  elementEnabled,
  elementSelected,
  executeDriverScript,
  execute,
  executeAsync,
  findElement,
  findElementFromElement,
  findElementFromShadowRoot,
  findElements,
  findElementsFromElement,
  findElementsFromShadowRoot,
  forward,
  fullScreenWindow,
  getAlertText,
  getAttribute,
  getComputedLabel,
  getComputedRole,
  getCookie,
  getCookies,
  getCssProperty,
  getElementRect,
  getElementScreenshot,
  getName,
  getPageSource,
  getProperty,
  getScreenshot,
  getText,
  getTimeouts,
  getUrl,
  getWindowHandle,
  getWindowHandles,
  getWindowRect,
  implicitWaitW3C,
  maximizeWindow,
  minimizeWindow,
  pageLoadTimeoutW3C,
  parentFrame,
  performActions,
  postAcceptAlert,
  postDismissAlert,
  printPage,
  refresh,
  releaseActions,
  scriptTimeoutW3C,
  setAlertText,
  setCookie,
  setFrame,
  setUrl,
  setValue,
  setWindow,
  setWindowRect,
  title,
  uploadFile,
};
