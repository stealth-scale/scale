import { describe, expect, it } from "vitest";

import { paletteThemes } from "#palette-themes.ts";

describe("paletteThemes", () => {
  it("lists the nine palette themes in the order the page offers them", () => {
    expect(paletteThemes.map((each) => each.name)).toStrictEqual([
      "cinder",
      "harbour",
      "admiral",
      "regatta",
      "pine",
      "carnival",
      "dusk",
      "neon",
      "blush",
    ]);
  });

  it("lists root themes alone with none derived from another", () => {
    expect(paletteThemes.every((each) => each.preset.presets === undefined)).toBe(true);
  });
});
