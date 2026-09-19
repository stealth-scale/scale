import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of violet in the violet's hue", () => {
    const purple = tokens.colors?.["purple"];

    expect(Object.keys(purple ?? {})).toHaveLength(11);
    expect(JSON.stringify(purple).match(/ 297\.8\)/gu)).toHaveLength(11);
  });

  it("draws the pink and the yellow ramps in their own hues", () => {
    expect(JSON.stringify(tokens.colors?.["pink"]).match(/ 6\.3\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["yellow"]).match(/ 86\.6\)/gu)).toHaveLength(11);
  });

  it("holds the grey ramp in the grape's hue at a low chroma", () => {
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 292\.0\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"])).toContain("oklch(58.0% 0.0400 292.0)");
  });
});
