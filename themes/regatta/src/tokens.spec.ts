import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of crimson in the crimson's hue", () => {
    const red = tokens.colors?.["red"];

    expect(Object.keys(red ?? {})).toHaveLength(11);
    expect(JSON.stringify(red).match(/ 20\.9\)/gu)).toHaveLength(11);
  });

  it("draws the deep blue and the teal and the grey ramps in their own hues", () => {
    expect(JSON.stringify(tokens.colors?.["blue"]).match(/ 243\.9\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["teal"]).match(/ 195\.2\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 259\.9\)/gu)).toHaveLength(11);
  });
});
