export default async function releaseActions(this: any) {
  const page = this.windows[this.currentHandle];
  if (!page) {
    throw new Error("No current window/page available");
  }

  try {
    // Make sure action devices exist
    if (!this.actionDevices) {
      return null;
    }

    // Release all active devices
    for (const [id, device] of Object.entries<any>(this.actionDevices)) {
      if (device.state.active) {
        if (device.type === "key") {
          // Release all keys
          await page.keyboard.releaseAllKeys();
        } else if (
          device.type === "pointer" &&
          device.parameters?.pointerType === "mouse"
        ) {
          // Release all mouse buttons
          await page.mouse.up({ button: "left" });
          await page.mouse.up({ button: "middle" });
          await page.mouse.up({ button: "right" });
        }

        // Mark the device as inactive
        device.state.active = false;
      }
    }

    return null;
  } catch (err: any) {
    throw new Error(`Failed to release actions: ${err.message}`);
  }
}
