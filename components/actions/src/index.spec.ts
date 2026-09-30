import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports only the nine public names", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Button",
      "ButtonPropsProvider",
      "Clipboard",
      "ColorModeToggle",
      "DownloadTrigger",
      "IconButton",
      "Swap",
      "ToggleGroup",
      "download",
    ]);
  });

  it("groups the swap's two parts under one namespace", () => {
    expect(Object.keys(barrel.Swap).toSorted()).toStrictEqual(["Indicator", "Root"]);
  });

  it("groups the clipboard's eight parts under one namespace by their short names", () => {
    expect(Object.keys(barrel.Clipboard).toSorted()).toStrictEqual([
      "Consumer",
      "Control",
      "Indicator",
      "Input",
      "Label",
      "Root",
      "Trigger",
      "ValueText",
    ]);
  });

  it("exports no recipe or binding helper at either level", () => {
    expect.hasAssertions();

    for (const name of [
      ...Object.keys(barrel),
      ...Object.keys(barrel.Clipboard),
      ...Object.keys(barrel.Swap),
    ]) {
      expect(name).not.toMatch(/^(?:recipe|with|use|PropsProvider)/u);
    }
  });
});
