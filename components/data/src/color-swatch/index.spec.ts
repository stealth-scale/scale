import { describe, expect, it } from "vitest";

import * as barrel from "#color-swatch/index.ts";

describe("index", () => {
  it("exports ColorSwatch and ColorSwatchMix and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual(["ColorSwatch", "ColorSwatchMix"]);
  });
});
