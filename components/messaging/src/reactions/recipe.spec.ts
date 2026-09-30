import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#reactions/reactions.specimen.tsx";
import { recipe } from "#reactions/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Reactions.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to reactions", () => {
    expect(recipe.className).toBe("reactions");
  });

  it("declares no axis", () => {
    expect(axesOf(recipe)).toStrictEqual([]);
  });

  it("removes the fieldset's border margin and padding from the root", () => {
    expect(recipe.base?.["root"]).toMatchObject({ borderWidth: "0", margin: "0", padding: "0" });
  });

  it("wraps the row of reactions", () => {
    expect(recipe.base?.["root"]).toMatchObject({ display: "flex", flexWrap: "wrap" });
  });

  it("sets a count in tabular figures", () => {
    expect(recipe.base?.["count"]).toStrictEqual({ fontVariantNumeric: "tabular-nums" });
  });
});
