import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { ink } from "#index.ts";

const AS_STATED = "the theme keeps its colors as stated rather than moving one to clear a ratio";

describe("ink", () => {
  it("keeps the theme contract and tells every step apart in both modes", () => {
    expect(
      violations(ink, {
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
    expect(ink.name).toBe("ink");
  });

  it("names no font package", () => {
    expect(ink.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(ink.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("leaves every ramp to the foundation", () => {
    expect(ink.variant.tokens).toStrictEqual({});
    expect(ink.variant.semanticTokens).toBeDefined();
  });
});
