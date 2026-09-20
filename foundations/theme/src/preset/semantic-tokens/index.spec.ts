import { describe, expect, it } from "vitest";

import { HUES, PALETTES } from "#authoring/contract.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";

describe("semanticTokens", () => {
  it("fills the six categories", () => {
    expect(Object.keys(semanticTokens).toSorted()).toStrictEqual([
      "colors",
      "gradients",
      "radii",
      "shadows",
      "sizes",
      "spacing",
    ]);
  });

  it("fills the four families and every palette", () => {
    expect(Object.keys(semanticTokens.colors).toSorted()).toStrictEqual(
      ["bg", "border", "code", "fg", ...HUES, ...PALETTES].toSorted(),
    );
  });
});
