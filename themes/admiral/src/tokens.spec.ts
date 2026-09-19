import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of the teal blue in its hue as the cyan ramp", () => {
    const cyan = tokens.colors?.["cyan"];

    expect(Object.keys(cyan ?? {})).toHaveLength(11);
    expect(JSON.stringify(cyan).match(/ 230\.5\)/gu)).toHaveLength(11);
  });

  it("draws the blue ramp from the blue and the grey in the navy's hue", () => {
    expect(JSON.stringify(tokens.colors?.["blue"]).match(/ 253\.1\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 254\.0\)/gu)).toHaveLength(11);
  });
});
