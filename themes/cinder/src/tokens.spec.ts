import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of red in the red's hue", () => {
    const red = tokens.colors?.["red"];

    expect(Object.keys(red ?? {})).toHaveLength(11);
    expect(JSON.stringify(red).match(/ 27\.5\)/gu)).toHaveLength(11);
  });

  it("draws the grey ramp in the slate's hue", () => {
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 251\.5\)/gu)).toHaveLength(11);
  });
});
