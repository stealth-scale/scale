import { describe, expect, it } from "vitest";

import { paletteThemes } from "#palette-themes.ts";

describe("paletteThemes", () => {
  it("lists the nine palette themes in the order the switcher offers them", () => {
    expect(paletteThemes.map((theme) => theme.name)).toStrictEqual([
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
});
