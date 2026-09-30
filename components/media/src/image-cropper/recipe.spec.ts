import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import page from "#image-cropper/image-cropper.specimen.tsx";
import { recipe } from "#image-cropper/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["ImageCropper"] })).toStrictEqual([]);
  });

  it("sets className to image-cropper", () => {
    expect(recipe.className).toBe("image-cropper");
  });

  it("declares the six parts of the machine", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "grid",
      "handle",
      "image",
      "root",
      "selection",
      "viewport",
    ]);
  });

  it("declares one axis defaulting to the l2 corners", () => {
    expect([axesOf(recipe), defaultsOf(recipe)]).toStrictEqual([["radius"], { radius: "l2" }]);
  });

  it("sets the corners on the viewport", () => {
    expect(recipe.variants?.["radius"]?.["l3"]).toStrictEqual({
      viewport: { borderRadius: "l3" },
    });
  });

  it("offers every corner but full", () => {
    expect(Object.keys(recipe.variants?.["radius"] ?? {})).toStrictEqual(["l1", "l2", "l3"]);
  });

  it("spans the viewport's width with the picture at its own ratio", () => {
    expect(recipe.base?.["image"]).toStrictEqual({
      blockSize: "auto",
      display: "block",
      inlineSize: "full",
      maxInlineSize: "none",
    });
  });

  it("sets a bg.panel hairline border on the selection", () => {
    expect(recipe.base?.["selection"]).toMatchObject({
      borderColor: "bg.panel",
      borderStyle: "solid",
      borderWidth: "hairline",
    });
  });

  it("sets an inset border.emphasized hairline over a backdrop spread on the selection", () => {
    expect(recipe.base?.["selection"]?.["boxShadow"]).toBe(
      "inset 0 0 0 {borderWidths.hairline} {colors.border.emphasized}, 0 0 0 100vmax {colors.bg.backdrop}",
    );
  });

  it("adds a bg.panel band under the focus ring of a focused selection", () => {
    expect(recipe.base?.["selection"]?.["_focusVisible"]).toStrictEqual({
      boxShadow:
        "inset 0 0 0 {borderWidths.hairline} {colors.border.emphasized}, 0 0 0 {spacing.ring} {colors.bg.panel}, 0 0 0 100vmax {colors.bg.backdrop}",
    });
  });

  it("sets the drag cursor on the viewport", () => {
    expect(recipe.base?.["viewport"]?.["cursor"]).toBe("drag");
  });

  it("sets the drag cursor on the selection", () => {
    expect(recipe.base?.["selection"]?.["cursor"]).toBe("drag");
  });

  it("sets the dragging cursor on a selection that moves", () => {
    expect(recipe.base?.["selection"]).toMatchObject({
      "&:is([data-dragging], [data-panning])": { cursor: "dragging" },
    });
  });

  it("rounds a circle selection", () => {
    expect(recipe.base?.["selection"]).toMatchObject({
      "&[data-shape=circle]": { borderRadius: "full" },
    });
  });

  it("makes a handle a 24px target", () => {
    expect(recipe.base?.["handle"]).toMatchObject({ blockSize: "6", inlineSize: "6" });
  });

  it("sets a larger dot on a corner handle", () => {
    expect(recipe.base?.["handle"]).toMatchObject({
      "&::after": { boxSize: "2.5" },
      "&:is([data-position=ne], [data-position=nw], [data-position=se], [data-position=sw])": {
        "&::after": { boxSize: "3" },
      },
    });
  });

  it("shows the grid only while the selection moves or the picture pans", () => {
    expect(recipe.base?.["grid"]).toMatchObject({
      "&:is([data-dragging], [data-panning])": { opacity: "1" },
      opacity: "0",
    });
  });

  it("matches every ImageCropper tag", () => {
    expect(recipe.jsx).toStrictEqual([/^ImageCropper(\.\w+)?$/u]);
  });
});
