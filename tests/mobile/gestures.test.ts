import { swipe, pinch, performTap, performSwipe } from "../../src/commands/mobile/gestures";
import Driver from "../../src/driver";

jest.mock("../../src/driver");

const mockDriver = new Driver({});
mockDriver.appiumClient = {
  performActions: jest.fn(),
  touchAction: jest.fn(),
};

describe("Gestures Commands", () => {
  let mockDriver: any;

  beforeEach(() => {
    mockDriver = {
      appiumClient: {
        performActions: jest.fn(),
        touchAction: jest.fn(),
      },
    };
  });

  it("should perform a swipe gesture", async () => {
    await swipe(mockDriver, "up");
    expect(mockDriver.appiumClient.performActions).toHaveBeenCalledWith([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: 50, y: 80 },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 1000, x: 50, y: 20 },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
  });

  it("should perform a pinch gesture", async () => {
    await pinch(mockDriver, true);
    expect(mockDriver.appiumClient.performActions).toHaveBeenCalled();
  });

  it("should perform a tap gesture", async () => {
    await performTap.call(mockDriver, 100, 200);
    expect(mockDriver.appiumClient.touchAction).toHaveBeenCalledWith({
      action: "tap",
      options: { x: 100, y: 200 },
    });
  });

  it("should perform a swipe gesture", async () => {
    await performSwipe.call(mockDriver, 0, 0, 100, 100);
    expect(mockDriver.appiumClient.touchAction).toHaveBeenCalledWith([
      { action: "press", options: { x: 0, y: 0 } },
      { action: "moveTo", options: { x: 100, y: 100 } },
      { action: "release" },
    ]);
  });

  it("should throw an error if Appium client is not initialized for tap", async () => {
    mockDriver.appiumClient = undefined;
    await expect(performTap.call(mockDriver, 100, 200)).rejects.toThrow(
      "Appium client is not initialized. Gestures can only be performed on mobile devices."
    );
  });

  it("should throw an error if Appium client is not initialized for swipe", async () => {
    mockDriver.appiumClient = undefined;
    await expect(performSwipe.call(mockDriver, 0, 0, 100, 100)).rejects.toThrow(
      "Appium client is not initialized. Gestures can only be performed on mobile devices."
    );
  });
});