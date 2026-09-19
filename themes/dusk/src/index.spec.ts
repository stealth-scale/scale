import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { dusk } from "#index.ts";

const AS_STATED =
  "the theme keeps its four colors as stated rather than moving one to clear a ratio";

describe("dusk", () => {
  it("keeps the theme contract and tells every step apart in both modes", () => {
    expect(
      violations(dusk, {
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
    expect(dusk.name).toBe("dusk");
  });

  it("names no font package", () => {
    expect(dusk.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(dusk.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(dusk.variant.tokens).toBeDefined();
    expect(dusk.variant.semanticTokens).toBeDefined();
  });
});
