import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import page from "#button/button.specimen.tsx";
import { recipe } from "#button/recipe.ts";

describe("recipe", () => {
  it("draws every axis it offers on its own page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("shows no source naming a value the recipe no longer offers", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("carries the source a reader copies on every scene it builds", () => {
    const built = page.scenes.filter((scene) => scene.axes !== undefined);

    expect(built.every((scene) => scene.source !== undefined)).toBe(true);
  });

  it("writes that source with every prop the cell is drawn with", () => {
    const statuses = page.scenes.find((scene) => scene.axes?.[0] === "status");

    expect(statuses?.source).toContain('<Button status="info" variant="solid">');
  });

  it("puts the import above the block", () => {
    const statuses = page.scenes.find((scene) => scene.axes?.[0] === "status");

    expect(statuses?.source).toContain('import { Button } from "@stealthscale/component-actions";');
  });

  it("writes the source of a scene it did not build off the same sample", () => {
    const stated = page.scenes.find((scene) => scene.title === "button.pressed.title");

    expect(stated?.source).toContain('<Button aria-pressed variant="solid">');
  });

  it("writes no value a theme cannot move", () => {
    expect(recipeViolations(recipe, { names: ["Button", "IconButton"] })).toStrictEqual([]);
  });

  it("names its class button", () => {
    expect(recipe.className).toBe("button");
  });

  it("offers the six axes a button takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "effect",
      "elevation",
      "shape",
      "size",
      "status",
      "variant",
    ]);
  });

  it("draws the middle size in the solid look when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "solid" });
  });

  it("offers the eight control sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("offers the six looks and the glass", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "ghost",
      "glass",
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("offers the four statuses and the neutral palette", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual([
      "error",
      "info",
      "neutral",
      "success",
      "warning",
    ]);
  });

  it("emits the square and every status whether or not a page writes them", () => {
    expect(recipe.staticCss).toStrictEqual([
      { shape: ["square"] },
      { status: ["info", "success", "warning", "error"] },
      { status: ["neutral"] },
    ]);
  });

  it("offers the square shape", () => {
    expect(valuesOf(recipe, "shape")).toStrictEqual(["square"]);
  });

  it("offers a glow that holds still and one that breathes", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow", "pulse"]);
  });

  it("states the shadow's colour on the breathing glow so the keyframe has one to read", () => {
    expect(recipe.variants?.["effect"]?.["pulse"]).toStrictEqual({
      animationStyle: "pulse-glow",
      boxShadowColor: "colorPalette.solid/50",
    });
  });

  it("ripples under every press and holds its box still", () => {
    expect(recipe.base).toMatchObject({ layerStyle: "ripple" });
    expect(recipe.base).not.toHaveProperty("_active");
  });

  it("offers a raised and a floating elevation", () => {
    expect(valuesOf(recipe, "elevation")).toStrictEqual(["floating", "raised"]);
  });

  it("drops the shadow of an elevated button as it is pressed", () => {
    expect(scaleOf(recipe, "elevation", "_active", ["raised", "floating"])).toStrictEqual([
      { boxShadow: "none" },
      { boxShadow: "sm" },
    ]);
  });

  it("clears the inset a leading mark takes off a square button", () => {
    expect(recipe.compoundVariants?.[0]).toStrictEqual({
      className: "button--squared",
      css: { "&:has(> svg:first-child)": { paddingInline: "0" } },
      shape: "square",
    });
  });

  it("fills a quiet look that is on with the subtle fill against the attributes that say so", () => {
    expect(recipe.compoundVariants?.[1]).toStrictEqual({
      className: "button--on",
      css: {
        _currentPage: {
          background: "colorPalette.subtle",
          color: "colorPalette.fg",
          fontWeight: "semibold",
        },
        _pressed: {
          background: "colorPalette.subtle",
          borderColor: "colorPalette.border",
          color: "colorPalette.fg",
        },
      },
      variant: ["ghost", "glass", "outline", "plain"],
    });
  });

  it("fills a look drawn in the subtle fill with the muted fill while it is on", () => {
    expect(recipe.compoundVariants?.[2]).toStrictEqual({
      className: "button--on-deeper",
      css: {
        _currentPage: {
          background: "colorPalette.muted",
          color: "colorPalette.fg",
          fontWeight: "semibold",
        },
        _pressed: {
          background: "colorPalette.muted",
          borderColor: "colorPalette.border",
          color: "colorPalette.fg",
        },
      },
      variant: ["subtle", "surface"],
    });
  });

  it("marks a solid button that is on with a line inside its own edge", () => {
    expect(recipe.compoundVariants).toHaveLength(4);
    expect(recipe.base?.["_pressed"]).toBeUndefined();
    expect(recipe.compoundVariants?.at(-1)).toStrictEqual({
      className: "button--on-marked",
      css: {
        _currentPage: { boxShadow: "inset", fontWeight: "semibold" },
        _pressed: { boxShadow: "inset", fontWeight: "semibold" },
      },
      variant: ["solid"],
    });
  });

  it("tracks every tag whose name ends in Button", () => {
    expect(recipe.jsx).toStrictEqual([/Button$/u]);
  });
});
