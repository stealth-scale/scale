import { describe, expect, it } from "vitest";

import actions from "@stealthscale/example-lib-actions/theme";
import { fathom } from "@stealthscale/example-theme-fathom";
import {
  colorAt,
  extendedRecipes,
  publishedRecipes,
  violations,
} from "@stealthscale/testing-theme";
import foundation from "@stealthscale/theme/theme";

import { abyss } from "#index.ts";

describe("abyss", () => {
  it("keeps the theme contract and clears every contrast pair in both modes", () => {
    expect(
      violations(abyss, {
        at: import.meta.dirname,
        base: foundation,
        recipes: { ...publishedRecipes(actions), badge: { className: "badge" } },
      }),
    ).toStrictEqual([]);
  });

  it("names itself as a page writes the attribute", () => {
    expect(abyss.name).toBe("abyss");
  });

  it("nests Fathom's preset beneath its own", () => {
    expect(abyss.preset.presets).toStrictEqual([fathom.preset]);
  });

  it("carries Fathom's values where it states none of its own", () => {
    expect(abyss.variant.semanticTokens?.["shadows"]).toStrictEqual(
      fathom.variant.semanticTokens?.["shadows"],
    );
    expect(colorAt(abyss, "fg", "base", {})).toBe(colorAt(fathom, "fg", "base", {}));
  });

  it("merges the pages it moves over Fathom's inks before the colors are drawn again", () => {
    expect(abyss.axes.colors?.light).toStrictEqual({
      ink: fathom.axes.colors?.light.ink,
      page: "oklch(93.0% 0.0200 195.0)",
    });
    expect(abyss.axes.colors?.secondary).toBe(fathom.axes.colors?.secondary);
  });

  it("states its own values over Fathom's", () => {
    expect(colorAt(abyss, "primary.solid", "base", {})).not.toBe(
      colorAt(fathom, "primary.solid", "base", {}),
    );
    expect(colorAt(abyss, "bg", "base", {})).toBe("oklch(93.0% 0.0200 195.0)");
    expect(abyss.variant.semanticTokens?.["radii"]).toMatchObject({ l3: { value: "0.5rem" } });
  });

  it("extends the badge and the button and nothing else", () => {
    expect(extendedRecipes(abyss)).toStrictEqual(["badge", "button"]);
  });
});
