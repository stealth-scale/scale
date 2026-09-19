import { describe, expect, it } from "vitest";

import { publishedThemes } from "#published-themes.ts";

describe("publishedThemes", () => {
  it("lists Ink first and the nine palette themes after it", () => {
    expect(publishedThemes.map((each) => each.name)).toStrictEqual([
      "ink",
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
