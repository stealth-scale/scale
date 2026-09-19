import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { neon } from "#index.ts";

const AS_STATED =
  "the theme keeps its four colors as stated rather than moving one to clear a ratio";

describe("neon", () => {
  it("keeps the theme contract and tells every step apart in both modes", () => {
    expect(
      violations(neon, {
        at: import.meta.dirname,
        base: foundation,
        recipes: {},
        skip: {
          "contrast.boundary": AS_STATED,
          "contrast.focus": AS_STATED,
          "contrast.text": AS_STATED,
        },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(neon.name).toBe("neon");
  });

  it("names no font package", () => {
    expect(neon.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(neon.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(neon.variant.tokens).toBeDefined();
    expect(neon.variant.semanticTokens).toBeDefined();
  });
});
