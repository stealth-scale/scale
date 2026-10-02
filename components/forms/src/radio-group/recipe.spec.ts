import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import {
  axesOf,
  defaultsOf,
  recipeViolations,
  scaleOf,
  valuesOf,
} from "@stealthscale/testing-theme";

import page from "#radio-group/radio-group.specimen.tsx";
import { recipe } from "#radio-group/recipe.ts";

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
        names: ["RadioGroup"],
        parts: ["root", "label", "item", "itemControl", "itemText"],
      }),
    ).toStrictEqual([]);
  });

  it("uses the class name radio-group", () => {
    expect(recipe.className).toBe("radio-group");
  });

  it("declares the five slots", () => {
    expect(recipe.slots).toStrictEqual(["root", "label", "item", "itemControl", "itemText"]);
  });

  it("declares five axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "palette", "size", "status", "variant"]);
  });

  it("defaults to solid circles at size md in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      align: "center",
      palette: "primary",
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

  it("declares the palette axis before the status axis so a status overrides it", () => {
    const axes = Object.keys(recipe.variants ?? {});

    expect(axes.indexOf("palette")).toBeLessThan(axes.indexOf("status"));
  });

  it("fills a checked circle with the look's layer style", () => {
    expect(scaleOf(recipe, "variant", "itemControl", ["solid", "subtle", "outline"])).toMatchObject(
      [
        { _checked: { layerStyle: "fill.solid" } },
        { _checked: { layerStyle: "fill.subtle" } },
        { _checked: { layerStyle: "outline.solid" } },
      ],
    );
  });

  it("scales the dot to 40% of the circle on a filled look", () => {
    expect(scaleOf(recipe, "variant", "itemControl", ["solid", "subtle"])).toMatchObject([
      { _checked: { _after: { scale: "0.4" } } },
      { _checked: { _after: { scale: "0.4" } } },
    ]);
  });

  it("scales the dot to 60% of the circle on the outline look", () => {
    expect(scaleOf(recipe, "variant", "itemControl", ["outline"])[0]).toMatchObject({
      _checked: { _after: { scale: "0.6" } },
    });
  });

  it("writes no border color on any look", () => {
    expect.hasAssertions();

    for (const look of scaleOf(recipe, "variant", "itemControl", ["outline", "solid", "subtle"])) {
      expect(look).not.toHaveProperty("borderColor");
    }
  });

  it("renders the dot in CanvasText under forced colors", () => {
    expect(recipe.base?.["itemControl"]?.["_highContrast"]).toStrictEqual({
      _checked: { _after: { background: "CanvasText", forcedColorAdjust: "none" } },
    });
  });

  it("renders the focus ring outside the circle", () => {
    expect(recipe.base?.["itemControl"]).toMatchObject({ focusVisibleRing: "outside" });
  });

  it("widens the target under a coarse pointer without raising the circle", () => {
    expect(recipe.base?.["itemControl"]?.["_touch"]).toHaveProperty("_before");
    expect(recipe.base?.["itemControl"]?.["_touch"]).not.toHaveProperty("minBlockSize");
  });

  it("sets only the cursor on a disabled row", () => {
    expect(recipe.base?.["item"]?.["_disabled"]).toStrictEqual({ cursor: "disabled" });
  });

  it("gives the label a line of its own in a horizontal group", () => {
    expect(recipe.base?.["root"]?.["_horizontal"]).toMatchObject({
      "& > .radio-group__label": { flexBasis: "full" },
      flexWrap: "wrap",
    });
  });

  it("sets a choice's words in the body role at the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemText"]).toStrictEqual({
      textStyle: "body.md",
    });
  });

  it("lays the label's words and a mark after them in a row the smallest gap apart", () => {
    expect(recipe.base?.["label"]).toMatchObject({
      display: "inline-flex",
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
    });
  });

  it("sets the group's label in the label role at the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["label"]).toStrictEqual({ textStyle: "label.md" });
  });

  it("tracks JSX named RadioGroup and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^RadioGroup(\.\w+)?$/u]);
  });
});
