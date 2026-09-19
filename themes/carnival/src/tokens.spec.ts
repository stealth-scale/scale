import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of red in the red's hue", () => {
    const red = tokens.colors?.["red"];

    expect(Object.keys(red ?? {})).toHaveLength(11);
    expect(JSON.stringify(red).match(/ 23\.5\)/gu)).toHaveLength(11);
  });

  it("draws the orange and the yellow and the grey ramps in their own hues", () => {
    expect(JSON.stringify(tokens.colors?.["orange"]).match(/ 45\.6\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["yellow"]).match(/ 88\.8\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 255\.6\)/gu)).toHaveLength(11);
  });
});
