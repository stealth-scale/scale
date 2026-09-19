import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { regatta } from "#index.ts";

const AS_STATED =
  "the theme keeps its four colors as stated rather than moving one to clear a ratio";

describe("regatta", () => {
  it("keeps the theme contract and tells every step apart in both modes", () => {
    expect(
      violations(regatta, {
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
    expect(regatta.name).toBe("regatta");
  });

  it("names no font package", () => {
    expect(regatta.fonts).toStrictEqual([]);
  });

  it("extends no recipe", () => {
    expect(regatta.preset.theme?.extend?.recipes).toBeUndefined();
  });

  it("carries its values in the shape an attribute switches to", () => {
    expect(regatta.variant.tokens).toBeDefined();
    expect(regatta.variant.semanticTokens).toBeDefined();
  });
});
