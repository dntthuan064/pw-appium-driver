import Driver from "../../driver";

export async function setGeolocation(
  this: Driver,
  latitude: number,
  longitude: number,
  altitude?: number,
) {
  if (!this.appiumClient) {
    throw new Error(
      "Appium client is not initialized. Geolocation can only be set for mobile devices.",
    );
  }

  await this.appiumClient.setGeoLocation({
    latitude,
    longitude,
    altitude: altitude || 0,
  });
}

export async function getGeolocation(driver: Driver) {
  if (!driver.appiumClient) {
    throw new Error("Geolocation is only supported on mobile devices.");
  }

  return await driver.appiumClient.getGeoLocation();
}
