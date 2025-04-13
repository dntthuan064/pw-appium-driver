import {
  setGeolocation,
  getGeolocation,
} from "../../src/commands/mobile/geolocation";
import Driver from "../../src/driver";

jest.mock("../../src/driver");

const mockDriver = new Driver({});
mockDriver.appiumClient = {
  setGeoLocation: jest.fn(),
  getGeoLocation: jest
    .fn()
    .mockResolvedValue({ latitude: 10, longitude: 20, altitude: 0 }),
};

describe("Geolocation Commands", () => {
  let mockDriver: any;

  beforeEach(() => {
    mockDriver = {
      appiumClient: {
        setGeoLocation: jest.fn(),
        getGeoLocation: jest
          .fn()
          .mockResolvedValue({ latitude: 10, longitude: 20, altitude: 0 }),
      },
    };
  });

  it("should set geolocation successfully", async () => {
    await setGeolocation.call(mockDriver, 37.7749, -122.4194, 10);
    expect(mockDriver.appiumClient.setGeoLocation).toHaveBeenCalledWith({
      latitude: 37.7749,
      longitude: -122.4194,
      altitude: 10,
    });
  });

  it("should throw an error if Appium client is not initialized", async () => {
    mockDriver.appiumClient = undefined;
    await expect(
      setGeolocation.call(mockDriver, 37.7749, -122.4194),
    ).rejects.toThrow(
      "Appium client is not initialized. Geolocation can only be set for mobile devices.",
    );
  });

  it("should set geolocation", async () => {
    await setGeolocation.call(mockDriver, 10, 20, 0);
    expect(mockDriver.appiumClient.setGeoLocation).toHaveBeenCalledWith({
      latitude: 10,
      longitude: 20,
      altitude: 0,
    });
  });

  it("should get geolocation", async () => {
    const location = await getGeolocation(mockDriver);
    expect(location).toEqual({ latitude: 10, longitude: 20, altitude: 0 });
    expect(mockDriver.appiumClient.getGeoLocation).toHaveBeenCalled();
  });
});
