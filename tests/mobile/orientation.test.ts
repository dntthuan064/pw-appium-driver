import {
  setOrientation,
  getOrientation,
} from "../../src/commands/mobile/orientation";

describe("Orientation Commands", () => {
  let mockDriver: any;

  beforeEach(() => {
    mockDriver = {
      appiumClient: {
        setOrientation: jest.fn(),
        getOrientation: jest.fn().mockResolvedValue("PORTRAIT"),
      },
    };
  });

  it("should set orientation successfully", async () => {
    await setOrientation.call(mockDriver, "LANDSCAPE");
    expect(mockDriver.appiumClient.setOrientation).toHaveBeenCalledWith(
      "LANDSCAPE",
    );
  });

  it("should get orientation successfully", async () => {
    const orientation = await getOrientation.call(mockDriver);
    expect(orientation).toBe("PORTRAIT");
    expect(mockDriver.appiumClient.getOrientation).toHaveBeenCalled();
  });

  it("should throw an error if Appium client is not initialized for setting orientation", async () => {
    mockDriver.appiumClient = undefined;
    await expect(setOrientation.call(mockDriver, "LANDSCAPE")).rejects.toThrow(
      "Appium client is not initialized. Orientation can only be set for mobile devices.",
    );
  });

  it("should throw an error if Appium client is not initialized for getting orientation", async () => {
    mockDriver.appiumClient = undefined;
    await expect(getOrientation.call(mockDriver)).rejects.toThrow(
      "Appium client is not initialized. Orientation can only be retrieved for mobile devices.",
    );
  });
});
