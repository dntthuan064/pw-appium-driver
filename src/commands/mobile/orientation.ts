import Driver from "../../driver";

export async function setOrientation(
  this: Driver,
  orientation: "LANDSCAPE" | "PORTRAIT",
) {
  if (!this.appiumClient) {
    throw new Error(
      "Appium client is not initialized. Orientation can only be set for mobile devices.",
    );
  }

  await this.appiumClient.setOrientation(orientation);
}

export async function getOrientation(this: Driver): Promise<string> {
  if (!this.appiumClient) {
    throw new Error(
      "Appium client is not initialized. Orientation can only be retrieved for mobile devices.",
    );
  }

  return await this.appiumClient.getOrientation();
}
