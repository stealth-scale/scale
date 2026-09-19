import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of coral in the coral's hue", () => {
    const red = tokens.colors?.["red"];

    expect(Object.keys(red ?? {})).toHaveLength(11);
    expect(JSON.stringify(red).match(/ 15\.6\)/gu)).toHaveLength(11);
  });

  it("draws the mauve and the plum and the grey ramps in their own hues", () => {
    expect(JSON.stringify(tokens.colors?.["pink"]).match(/ 2\.4\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["purple"]).match(/ 308\.6\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 245\.6\)/gu)).toHaveLength(11);
  });
});
