import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Badge",
      "BadgePropsProvider",
      "ColorSwatch",
      "ColorSwatchMix",
      "Stat",
      "Status",
      "Tag",
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
