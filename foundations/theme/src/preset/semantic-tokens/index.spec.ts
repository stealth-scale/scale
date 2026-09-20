import { describe, expect, it } from "vitest";

import { HUES, PALETTES } from "#contract.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";

describe("semanticTokens", () => {
  it("fills the nine categories", () => {
    expect(Object.keys(semanticTokens).toSorted()).toStrictEqual([
      "borderWidths",
      "colors",
      "durations",
      "easings",
      "gradients",
      "radii",
      "shadows",
      "sizes",
      "spacing",
    ]);
  });

  it("fills the four families and every intent and every hue palette", () => {
    expect(Object.keys(semanticTokens.colors).toSorted()).toStrictEqual(
      ["bg", "border", "code", "fg", ...HUES, ...PALETTES].toSorted(),
    );
  });
});
