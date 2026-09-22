import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import page from "#checkbox/checkbox.specimen.tsx";
import { recipe } from "#checkbox/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Checkbox"],
        parts: ["root", "control", "indicator", "label"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class checkbox", () => {
    expect(recipe.className).toBe("checkbox");
  });

  it("styles the four parts a checkbox draws", () => {
    expect(recipe.slots).toStrictEqual(["root", "control", "indicator", "label"]);
  });

  it("offers the seven axes a checkbox takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "motion",
      "radius",
      "size",
      "spread",
      "status",
      "variant",
    ]);
  });

  it("draws a filled box beside its words when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "center",
      radius: "l1",
      size: "md",
      variant: "solid",
    });
  });

  it("offers the three ways the box is drawn", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle"]);
  });

  it("leaves the edge to the status on every look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).not.toHaveProperty("borderColor");
    }
  });

  it("keeps the mark out of the layout while the machine hides it", () => {
    expect(recipe.base?.["indicator"]?.["&[hidden]"]).toStrictEqual({ display: "none" });
  });

  it("draws the focus ring outside a box too small to hold one", () => {
    expect(recipe.base?.["control"]).toMatchObject({ focusVisibleRing: "outside" });
  });

  it("widens the target under a coarse pointer rather than raising the box", () => {
    expect(recipe.base?.["control"]?.["_touch"]).toHaveProperty("_before");
    expect(recipe.base?.["control"]?.["_touch"]).not.toHaveProperty("minBlockSize");
  });

  it("takes the width it is given where the box sits at the far end", () => {
    expect(scaleOf(recipe, "spread", "root", ["true"])[0]).toMatchObject({ inlineSize: "full" });
  });

  it("tracks every tag under the Checkbox namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Checkbox(\.\w+)?$/u]);
  });
});
