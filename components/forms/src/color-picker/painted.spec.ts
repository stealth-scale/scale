import { describe, expect, it } from "vitest";

import { painted } from "#color-picker/painted.ts";

describe("painted", () => {
  it("moves the paint into the custom property", () => {
    expect(painted({ background: "red" }, "background", "--fill")).toStrictEqual({
      "--fill": "red",
    });
  });

  it("keeps the machine's other inline properties", () => {
    expect(
      painted({ backgroundImage: "none", position: "relative" }, "backgroundImage", "--fill"),
    ).toStrictEqual({ "--fill": "none", position: "relative" });
  });

  it("sets the custom property to none without a paint", () => {
    expect(painted(undefined, "background", "--fill")).toStrictEqual({ "--fill": "none" });
  });
});
