import Driver from "../../driver";

export async function performTap(this: Driver, x: number, y: number) {
  if (!this.appiumClient) {
    throw new Error(
      "Appium client is not initialized. Gestures can only be performed on mobile devices.",
    );
  }

  await this.appiumClient.touchAction({
    action: "tap",
    options: { x, y },
  });
}

export async function performSwipe(
  this: Driver,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  if (!this.appiumClient) {
    throw new Error(
      "Appium client is not initialized. Gestures can only be performed on mobile devices.",
    );
  }

  await this.appiumClient.touchAction([
    { action: "press", options: { x: startX, y: startY } },
    { action: "moveTo", options: { x: endX, y: endY } },
    { action: "release" },
  ]);
}

export async function swipe(
  driver: Driver,
  direction: "up" | "down" | "left" | "right",
) {
  if (!driver.appiumClient) {
    throw new Error("Swipe is only supported on mobile devices.");
  }

  const actions = {
    up: { startX: 50, startY: 80, endX: 50, endY: 20 },
    down: { startX: 50, startY: 20, endX: 50, endY: 80 },
    left: { startX: 80, startY: 50, endX: 20, endY: 50 },
    right: { startX: 20, startY: 50, endX: 80, endY: 50 },
  }[direction];

  await driver.appiumClient.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        {
          type: "pointerMove",
          duration: 0,
          x: actions.startX,
          y: actions.startY,
        },
        { type: "pointerDown", button: 0 },
        {
          type: "pointerMove",
          duration: 1000,
          x: actions.endX,
          y: actions.endY,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
}

export async function pinch(driver: Driver, zoomIn: boolean) {
  if (!driver.appiumClient) {
    throw new Error("Pinch is only supported on mobile devices.");
  }

  const scale = zoomIn ? 1.5 : 0.5;
  await driver.appiumClient.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 50, y: 50 },
        { type: "pointerDown", button: 0 },
        { type: "pointerMove", duration: 1000, x: 50 * scale, y: 50 * scale },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
}
