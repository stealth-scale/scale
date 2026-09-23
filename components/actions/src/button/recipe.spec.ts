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
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe no longer offers", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("writes aria-pressed and the solid look into the source of the pressed scene", () => {
    const stated = page.scenes.find((scene) => scene.title === "button.pressed.title");

    expect(stated?.props).toStrictEqual({ "aria-pressed": true, variant: "solid" });
  });

  it("writes disabled and the solid look into the source of the disabled scene", () => {
    const stated = page.scenes.find((scene) => scene.title === "button.disabled.title");

    expect(stated?.props).toStrictEqual({ disabled: true, variant: "solid" });
  });

  it("references a token on every value for Button and IconButton", () => {
    expect(recipeViolations(recipe, { names: ["Button", "IconButton"] })).toStrictEqual([]);
  });

  it("sets className to button", () => {
    expect(recipe.className).toBe("button");
  });

  it("declares six variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "effect",
      "elevation",
      "palette",
      "shape",
      "size",
      "variant",
    ]);
  });

  it("defaults size to md and variant to solid", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "solid" });
  });

  it("sets colorPalette to primary in the base", () => {
    expect(recipe.base).toMatchObject({ colorPalette: "primary" });
  });

  it("declares eight size values from xs to 4xl", () => {
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

  it("declares the six shared looks plus glass", () => {
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

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("sets colorPalette to the palette of the same name", () => {
    expect(recipe.variants?.["palette"]?.["secondary"]).toStrictEqual({
      colorPalette: "secondary",
    });
  });

  it("lists the square shape and every palette under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([
      { shape: ["square"] },
      {
        palette: [
          "primary",
          "secondary",
          "accent",
          "neutral",
          "info",
          "success",
          "warning",
          "error",
        ],
      },
    ]);
  });

  it("declares square as the only shape value", () => {
    expect(valuesOf(recipe, "shape")).toStrictEqual(["square"]);
  });

  it("declares glow and pulse as the effect values", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow", "pulse"]);
  });

  it("sets the pulse animation style and its shadow colour on the pulse effect", () => {
    expect(recipe.variants?.["effect"]?.["pulse"]).toStrictEqual({
      animationStyle: "pulse-glow",
      boxShadowColor: "colorPalette.solid/50",
    });
  });

  it("applies the ripple layer style in its base", () => {
    expect(recipe.base).toMatchObject({ layerStyle: "ripple" });
  });

  it("declares no _active styles in its base", () => {
    expect(recipe.base).not.toHaveProperty("_active");
  });

  it("declares raised and floating as the elevation values", () => {
    expect(valuesOf(recipe, "elevation")).toStrictEqual(["floating", "raised"]);
  });

  it("lowers each elevation's shadow by one step under _active", () => {
    expect(scaleOf(recipe, "elevation", "_active", ["raised", "floating"])).toStrictEqual([
      { boxShadow: "none" },
      { boxShadow: "sm" },
    ]);
  });

  it("zeroes the inline padding of a square whose first child is an svg", () => {
    expect(recipe.compoundVariants?.[0]).toStrictEqual({
      className: "button--squared",
      css: { "&:has(> svg:first-child)": { paddingInline: "0" } },
      shape: "square",
    });
  });

  it("fills the four unfilled looks with colorPalette.subtle when pressed or current", () => {
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

  it("fills the subtle and surface looks with colorPalette.muted when pressed or current", () => {
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

  it("declares no _pressed styles in its base", () => {
    expect(recipe.base?.["_pressed"]).toBeUndefined();
  });

  it("applies the inset shadow to the solid look when pressed or current", () => {
    expect(recipe.compoundVariants).toHaveLength(4);
    expect(recipe.compoundVariants?.at(-1)).toStrictEqual({
      className: "button--on-marked",
      css: {
        _currentPage: { boxShadow: "inset", fontWeight: "semibold" },
        _pressed: { boxShadow: "inset", fontWeight: "semibold" },
      },
      variant: ["solid"],
    });
  });

  it("matches JSX tag names ending in Button", () => {
    expect(recipe.jsx).toStrictEqual([/Button$/u]);
  });
});
