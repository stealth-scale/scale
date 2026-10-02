import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Badge",
      "BadgePropsProvider",
      "ColorSwatch",
      "ColorSwatchMix",
      "Format",
      "QrCode",
      "Stat",
      "Status",
      "Tag",
      "Timer",
      "Timestamp",
    ]);
  });

  it("exports QrCode as a namespace of its parts", () => {
    expect(Object.keys(barrel.QrCode).toSorted()).toStrictEqual([
      "DownloadTrigger",
      "Frame",
      "Overlay",
      "Pattern",
      "Root",
    ]);
  });

  it("exports Timer as a namespace of its parts and the parser", () => {
    expect(Object.keys(barrel.Timer).toSorted()).toStrictEqual([
      "ActionTrigger",
      "Area",
      "Control",
      "Item",
      "Root",
      "Separator",
      "parse",
    ]);
  });

  it("exports Tag as a namespace of its parts", () => {
    expect(Object.keys(barrel.Tag).toSorted()).toStrictEqual([
      "CloseTrigger",
      "EndElement",
      "Label",
      "Root",
      "StartElement",
    ]);
  });

  it("exports Stat as a namespace of its parts", () => {
    expect(Object.keys(barrel.Stat).toSorted()).toStrictEqual([
      "HelpText",
      "Indicator",
      "Label",
      "Root",
      "ValueText",
      "ValueUnit",
    ]);
  });

  it("exports Format as a namespace of its two formats", () => {
    expect(Object.keys(barrel.Format).toSorted()).toStrictEqual(["Byte", "Number"]);
  });

  it("exports Status as a namespace of its parts", () => {
    expect(Object.keys(barrel.Status).toSorted()).toStrictEqual(["Indicator", "Root"]);
  });

  it("exports no name that starts with recipe or with or use", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|use)/u);
    }
  });
});
