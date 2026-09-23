import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  slotsOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#roving-focus/recipe.ts";
import page from "#roving-focus/roving-focus.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["RovingFocus.Root", "RovingFocus.Item"] }),
    ).toStrictEqual([]);
  });

  it("sets className to roving-focus", () => {
    expect(recipe.className).toBe("roving-focus");
  });

  it("declares the item and root slots", () => {
    expect(slotsOf(recipe)).toStrictEqual(["item", "root"]);
  });

  it("declares one variant axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation"]);
  });

  it("declares three orientations on the orientation axis", () => {
    expect(valuesOf(recipe, "orientation")).toStrictEqual(["both", "horizontal", "vertical"]);
  });

  it("defaults orientation to horizontal", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ orientation: "horizontal" });
  });

  it("sets flexWrap on the root when the orientation is both", () => {
    expect(recipe.variants?.["orientation"]).toMatchObject({
      both: { root: { flexWrap: "wrap" } },
    });
  });

  it("matches the RovingFocus JSX tags", () => {
    expect(recipe.jsx).toStrictEqual([/^RovingFocus(\.\w+)?$/u]);
  });
});
