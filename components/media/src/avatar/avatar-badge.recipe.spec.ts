import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { BADGE, recipe } from "#avatar/avatar-badge.recipe.ts";
import page from "#avatar/avatar.specimen.tsx";
import { SIZE } from "#avatar/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Avatar.Badge"] })).toStrictEqual([]);
  });

  it("sets className to avatar-badge", () => {
    expect(recipe.className).toBe("avatar-badge");
  });

  it("declares palette placement and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "placement", "variant"]);
  });

  it("defaults to a neutral solid badge on the bottom end corner", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "neutral",
      placement: "bottom-end",
      variant: "solid",
    });
  });

  it("sizes an empty badge from the avatar's side with an 8px floor", () => {
    expect(recipe.base).toMatchObject({ [BADGE]: `max({sizes.2}, calc(var(${SIZE}) * 0.28))` });
  });

  it("sizes a badge with content from the avatar's side with a 16px floor", () => {
    expect(recipe.base).toMatchObject({
      "&:not(:empty)": { [BADGE]: `max({sizes.4}, calc(var(${SIZE}) * 0.4))` },
    });
  });

  it("centres the badge on the point where the diagonal crosses the rim", () => {
    expect(recipe.variants?.["placement"]?.["bottom-end"]).toStrictEqual({
      _rtl: { translate: "-50% 50%" },
      insetBlockEnd: `calc(var(${SIZE}) * 0.1464)`,
      insetInlineEnd: `calc(var(${SIZE}) * 0.1464)`,
      translate: "50% 50%",
    });
  });

  it("rings the badge in the panel's ground", () => {
    expect(recipe.base).toMatchObject({ outlineColor: "bg.panel", outlineStyle: "solid" });
  });
});
