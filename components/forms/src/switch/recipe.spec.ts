import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import { recipe } from "#switch/recipe.ts";
import page from "#switch/switch.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Switch"],
        parts: ["root", "control", "thumb", "label"],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name switch", () => {
    expect(recipe.className).toBe("switch");
  });

  it("declares the four slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "control", "thumb", "label"]);
  });

  it("declares seven axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "align",
      "palette",
      "radius",
      "size",
      "spread",
      "status",
      "variant",
    ]);
  });

  it("defaults to a solid round track at size md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "center",
      palette: "primary",
      radius: "full",
      size: "md",
      variant: "solid",
    });
  });

  it("offers three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "solid", "subtle"]);
  });

  it("offers the four palettes that are not statuses", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "neutral",
      "primary",
      "secondary",
    ]);
  });

  it("emits every palette it offers", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral"],
    });
  });

  it("declares the palette axis before the status axis", () => {
    const axes = Object.keys(recipe.variants ?? {});

    expect(axes.indexOf("palette")).toBeLessThan(axes.indexOf("status"));
  });

  it("writes no border color on any look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "control", ["outline", "solid", "subtle"])) {
      expect(look).not.toHaveProperty("borderColor");
    }
  });

  it("rests the track on the panel", () => {
    expect(recipe.base?.["control"]).toMatchObject({ background: "bg.panel" });
  });

  it("rests a subtle track on the subtle surface", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["control"]).toMatchObject({
      background: "bg.subtle",
    });
  });

  it("fills the off thumb with the field's edge color", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({ background: "var(--field-edge)" });
  });

  it("fills a checked solid thumb with the palette's contrast ink", () => {
    expect(recipe.variants?.["variant"]?.["solid"]?.["thumb"]).toMatchObject({
      _checked: { background: "colorPalette.contrast" },
    });
  });

  it("fills a checked subtle thumb with the palette's solid", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["thumb"]).toMatchObject({
      _checked: { background: "colorPalette.solid" },
    });
  });

  it("fills a checked outline thumb with the palette's solid", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["thumb"]).toMatchObject({
      _checked: { background: "colorPalette.solid" },
    });
  });

  it("fills a checked thumb with CanvasText under forced colors in every look", () => {
    const forced = {
      thumb: {
        _checked: { _highContrast: { background: "CanvasText", forcedColorAdjust: "none" } },
      },
    };

    expect(recipe.variants?.["variant"]).toMatchObject({
      outline: forced,
      solid: forced,
      subtle: forced,
    });
  });

  it("sizes the thumb as a square the height of the track's content box", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({ aspectRatio: "square", blockSize: "full" });
  });

  it("sets the thumb's travel to the track's width less its height", () => {
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

  it("translates a checked thumb by the travel", () => {
    expect(recipe.base?.["thumb"]?.["_checked"]).toMatchObject({
      translate: "var(--switch-travel)",
    });
  });

  it("negates the travel of a checked thumb in a right-to-left row", () => {
    expect(recipe.base?.["thumb"]?.["_checked"]?.["_rtl"]).toStrictEqual({
      translate: "calc(var(--switch-travel) * -1)",
    });
  });

  it("borders the thumb in ButtonText under forced colors", () => {
    expect(recipe.base?.["thumb"]?.["_highContrast"]).toStrictEqual({
      borderColor: "ButtonText",
      borderStyle: "solid",
      borderWidth: "control",
    });
  });

  it("transitions the translate property", () => {
    expect(recipe.base?.["thumb"]).toMatchObject({
      transitionProperty: "translate, background, box-shadow",
    });
  });

  it("drops the transition under reduced motion", () => {
    expect(recipe.base?.["thumb"]?.["_motionReduce"]).toStrictEqual({ transitionDuration: "0s" });
  });

  it("renders the focus ring outside the track", () => {
    expect(recipe.base?.["control"]).toMatchObject({ focusVisibleRing: "outside" });
  });

  it("widens the target under a coarse pointer without raising the track", () => {
    expect(recipe.base?.["control"]?.["_touch"]).toHaveProperty("_before");
    expect(recipe.base?.["control"]?.["_touch"]).not.toHaveProperty("minBlockSize");
  });

  it("takes the full width on a spread row", () => {
    expect(scaleOf(recipe, "spread", "root", ["true"])[0]).toMatchObject({ inlineSize: "full" });
  });

  it("tracks JSX named Switch and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Switch(\.\w+)?$/u]);
  });
});
