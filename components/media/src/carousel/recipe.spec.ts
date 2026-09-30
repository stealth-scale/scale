import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";
import { dense } from "@stealthscale/theme/authoring";

import page from "#carousel/carousel.specimen.tsx";
import { GAP, recipe } from "#carousel/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Carousel"] })).toStrictEqual([]);
  });

  it("sets className to carousel", () => {
    expect(recipe.className).toBe("carousel");
  });

  it("declares the ten parts of the machine", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "autoplayTrigger",
      "control",
      "indicator",
      "indicatorGroup",
      "item",
      "itemGroup",
      "nextTrigger",
      "prevTrigger",
      "progressText",
      "root",
    ]);
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["controls", "palette", "radius", "ratio"]);
  });

  it("defaults to controls beside the slides with neutral dots on l3 slides", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      controls: "outside",
      palette: "neutral",
      radius: "l3",
    });
  });

  it("sets the gap between slides to the gap.md token", () => {
    expect(recipe.base?.["root"]?.[GAP]).toBe(dense("{spacing.gap.md}"));
  });

  it("makes a dot a 24px target", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ boxSize: "6" });
  });

  it("sets an 8px mark in the palette's border role on a dot", () => {
    expect(recipe.base?.["indicator"]?.["&::after"]).toMatchObject({
      background: "colorPalette.border",
      blockSize: "2",
      inlineSize: "2",
    });
  });

  it("widens the current dot to a 20px pill in the palette's solid", () => {
    expect(recipe.base?.["indicator"]?.["_current"]).toMatchObject({
      "&::after": { background: "colorPalette.solid", inlineSize: "5" },
    });
  });

  it("paints the current dot in Highlight under forced colors", () => {
    expect(recipe.base?.["indicator"]?.["_highContrast"]).toMatchObject({
      _current: { "&::after": { background: "Highlight" } },
    });
  });

  it("covers a slide with a picture that is its child", () => {
    expect(recipe.base?.["item"]?.["& > img"]).toStrictEqual({
      blockSize: "full",
      display: "block",
      inlineSize: "full",
      objectFit: "cover",
    });
  });

  it("gives a vertical scroller the landscape ratio", () => {
    expect(recipe.base?.["itemGroup"]?.["&[data-orientation=vertical]"]).toMatchObject({
      aspectRatio: "landscape",
    });
  });

  it("puts the scroller and the control in one grid cell over the slides", () => {
    expect([
      recipe.variants?.["controls"]?.["overlay"]?.["itemGroup"],
      recipe.variants?.["controls"]?.["overlay"]?.["control"]?.["gridArea"],
    ]).toStrictEqual([{ gridArea: "1 / 1 / 2 / 2" }, "1 / 1 / 2 / 2"]);
  });

  it("pads the overlaid dots' bg.panel pill by a focus ring", () => {
    expect(recipe.variants?.["controls"]?.["overlay"]?.["indicatorGroup"]).toMatchObject({
      background: "bg.panel",
      padding: "0.5",
    });
  });

  it("sets the palette on the dots", () => {
    expect(recipe.variants?.["palette"]?.["primary"]).toStrictEqual({
      indicator: { colorPalette: "primary" },
    });
  });

  it("sets the corners on the slides and on the scroller", () => {
    expect(recipe.variants?.["radius"]?.["l1"]).toStrictEqual({
      item: { borderRadius: "l1" },
      itemGroup: { borderRadius: "l1" },
    });
  });

  it("offers every corner but full", () => {
    expect(Object.keys(recipe.variants?.["radius"] ?? {})).toStrictEqual(["l1", "l2", "l3"]);
  });

  it("sets the ratio on the scroller", () => {
    expect(recipe.variants?.["ratio"]?.["wide"]).toStrictEqual({
      itemGroup: { aspectRatio: "wide" },
    });
  });

  it("matches every Carousel tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Carousel(\.\w+)?$/u]);
  });
});
