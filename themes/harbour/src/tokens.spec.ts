import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of the steel blue in its hue as the blue ramp", () => {
    const blue = tokens.colors?.["blue"];

    expect(Object.keys(blue ?? {})).toHaveLength(11);
    expect(JSON.stringify(blue).match(/ 241\.5\)/gu)).toHaveLength(11);
  });

  it("draws the deep blue as the indigo ramp and the grey in the navy's hue", () => {
    expect(JSON.stringify(tokens.colors?.["indigo"]).match(/ 242\.8\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 241\.4\)/gu)).toHaveLength(11);
  });
});
