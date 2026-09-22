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

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("reports no violation across the shared recipe checks", () => {
    expect(
      recipeViolations(recipe, { names: ["RovingFocus.Root", "RovingFocus.Item"] }),
    ).toStrictEqual([]);
  });

  it("sets className to roving-focus", () => {
    expect(recipe.className).toBe("roving-focus");
  });

  it("declares item and root as its only slots", () => {
    expect(slotsOf(recipe)).toStrictEqual(["item", "root"]);
  });

  it("declares orientation as its only variant", () => {
    expect(axesOf(recipe)).toStrictEqual(["orientation"]);
  });

  it("declares both horizontal and vertical as the values of orientation", () => {
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

  it("matches RovingFocus and its dotted parts with its jsx pattern", () => {
    expect(recipe.jsx).toStrictEqual([/^RovingFocus(\.\w+)?$/u]);
  });
});
