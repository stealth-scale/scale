import { describe, expect, it } from "vitest";

import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#switch/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Switch"],
        parts: ["root", "control", "thumb", "label"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class switch", () => {
    expect(recipe.className).toBe("switch");
  });

  it("styles the four parts a switch draws", () => {
    expect(recipe.slots).toStrictEqual(["root", "control", "thumb", "label"]);
  });

  it("offers the six axes a switch takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "radius",
      "size",
      "spread",
      "status",
      "variant",
    ]);
  });

  it("draws a filled track with a round end when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "center",
      radius: "full",
      size: "md",
      variant: "solid",
    });
  });

  it("offers the three ways the track is drawn", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle"]);
  });

  it("leaves the edge to the status on every look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).not.toHaveProperty("borderColor");
    }
  });

  it("draws the track on the muted surface so the thumb reads against it", () => {
    expect(recipe.base?.["control"]).toMatchObject({ background: "bg.muted" });
    expect(recipe.base?.["thumb"]).toMatchObject({ background: "bg.panel" });
  });

  it("sizes the thumb from the track rather than from a scale of its own", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({ aspectRatio: "square", blockSize: "full" });
  });

  it("gives the thumb the track's width less its height to cross", () => {
    expect(scaleOf(recipe, "size", "control", ["sm", "md", "lg"])).toStrictEqual([
      expect.objectContaining({
        "--switch-travel": "calc({sizes.control.sm} - {sizes.tag.sm})",
      }),
      expect.objectContaining({
        "--switch-travel": "calc({sizes.control.md} - {sizes.tag.md})",
      }),
      expect.objectContaining({
        "--switch-travel": "calc({sizes.control.lg} - {sizes.tag.lg})",
      }),
    ]);
  });

  it("moves the thumb by the distance the track states", () => {
    expect(recipe.base?.["thumb"]?.["_checked"]).toStrictEqual({
      _rtl: { translate: "calc(var(--switch-travel) * -1)" },
      translate: "var(--switch-travel)",
    });
  });

  it("marks the thumb's edge where the display replaces every fill", () => {
    expect(recipe.base?.["thumb"]?.["_highContrast"]).toStrictEqual({
      borderColor: "ButtonText",
      borderStyle: "solid",
      borderWidth: "control",
    });
  });

  it("names the property the thumb actually moves in", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({
      transitionProperty: "translate, background, box-shadow",
    });
  });

  it("holds the thumb still for a reader who asks for less motion", () => {
    expect(recipe.base?.["thumb"]?.["_motionReduce"]).toStrictEqual({ transitionDuration: "0s" });
  });

  it("draws the focus ring outside a track too short to hold one", () => {
    expect(recipe.base?.["control"]).toMatchObject({ focusVisibleRing: "outside" });
  });

  it("widens the target under a coarse pointer rather than raising the track", () => {
    expect(recipe.base?.["control"]?.["_touch"]).toHaveProperty("_before");
    expect(recipe.base?.["control"]?.["_touch"]).not.toHaveProperty("minBlockSize");
  });

  it("tracks every tag under the Switch namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Switch(\.\w+)?$/u]);
  });
});
