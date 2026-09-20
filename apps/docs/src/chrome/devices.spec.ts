import { describe, expect, it } from "vitest";

import { deviceOf, PATHS } from "#chrome/devices.ts";

describe("deviceOf", () => {
  it("says the window is a monitor", () => {
    expect(deviceOf()).toBe("monitor");
  });

  it("says which device a width starts at", () => {
    expect([320, 640, 1024, 1280, 1536].map((width) => deviceOf(width))).toStrictEqual([
      "phone",
      "tablet",
      "laptop",
      "monitor",
      "monitor",
    ]);
  });
});

describe("PATHS", () => {
  it("draws a mark for every device", () => {
    expect(Object.keys(PATHS).toSorted()).toStrictEqual(["laptop", "monitor", "phone", "tablet"]);
  });
});
