import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of pink in the pink's hue", () => {
    const pink = tokens.colors?.["pink"];

    expect(Object.keys(pink ?? {})).toHaveLength(11);
    expect(JSON.stringify(pink).match(/ 353\.6\)/gu)).toHaveLength(11);
  });

  it("holds the grey ramp in the navy's hue at a low chroma", () => {
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/ 263\.0\)/gu)).toHaveLength(11);
    expect(JSON.stringify(tokens.colors?.["gray"])).toContain("oklch(58.0% 0.0400 263.0)");
  });
});
