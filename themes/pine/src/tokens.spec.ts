import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of the green in the green's hue as the teal ramp", () => {
    const teal = tokens.colors?.["teal"];

    expect(Object.keys(teal ?? {})).toHaveLength(11);
    expect(JSON.stringify(teal).match(/ 162\.5\)/gu)).toHaveLength(11);
  });

  it("draws the sage as the green ramp and the teal as the cyan ramp and the grey in the night's hue", () => {
    expect(JSON.stringify(tokens.colors?.["green"]).match(/ 148\.7\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["cyan"]).match(/ 187\.4\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 212\.3\)/gu)).toHaveLength(11);
  });
});
