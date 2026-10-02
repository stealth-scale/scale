import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { BOUNDARY, recipe } from "#tour/recipe.ts";
import page from "#tour/tour.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Tour"] })).toStrictEqual([]);
  });

  it("sets className to tour", () => {
    expect(recipe.className).toBe("tour");
  });

  it("declares thirteen slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "actionTrigger",
      "arrow",
      "arrowTip",
      "backdrop",
      "closeTrigger",
      "content",
      "control",
      "description",
      "positioner",
      "progressText",
      "root",
      "spotlight",
      "title",
    ]);
  });

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares the palette size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "variant"]);
  });

  it("defaults to an elevated md card with a primary ring", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "primary",
      size: "md",
      variant: "elevated",
    });
  });

  it("offers the sizes sm md lg", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("stacks every layer on the modal rung plus the layer the machine writes", () => {
    expect.hasAssertions();

    for (const part of ["backdrop", "spotlight", "positioner", "content"] as const) {
      expect(recipe.base?.[part]).toMatchObject({
        zIndex: "calc(var(--tour-layer, 0) + var(--tour-z-index))",
      });
    }
  });

  it("puts the modal rung on every portalled layer", () => {
    expect.hasAssertions();

    for (const part of ["backdrop", "spotlight", "positioner"] as const) {
      expect(recipe.base?.[part]).toMatchObject({ "--tour-z-index": "{zIndex.modal}" });
    }
  });

  it("makes the backdrop as tall as the document outside a dialog step", () => {
    expect(recipe.base?.["backdrop"]).toMatchObject({
      "&:not([data-type=dialog])": { blockSize: `var(${BOUNDARY})` },
    });
  });

  it("centres a dialog step's card in the window", () => {
    expect(recipe.base?.["positioner"]).toMatchObject({
      "&[data-type=dialog]": { alignItems: "center", inset: "0", position: "fixed" },
    });
  });

  it("fixes a floating step's card to the window", () => {
    expect(recipe.base?.["positioner"]).toMatchObject({
      "&[data-type=floating]": { pointerEvents: "none", position: "fixed" },
    });
  });

  it("caps a tooltip step's card at the room beside its target", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      inlineSize: "min({sizes.sm}, var(--available-width, {sizes.sm}))",
    });
  });

  it("moves the ring between targets at the move pace", () => {
    expect(recipe.base?.["spotlight"]).toMatchObject({
      transitionDuration: "move",
      transitionProperty: "left, top, width, height",
    });
  });

  it("sets the ring in the palette's solid role", () => {
    expect(recipe.base?.["spotlight"]).toMatchObject({ borderColor: "colorPalette.solid" });
  });

  it("puts a progress text inside the control at its start", () => {
    expect(recipe.base?.["control"]).toMatchObject({
      "& > .tour__progressText": { marginInlineEnd: "auto" },
    });
  });

  it("edges the elevated card with a transparent hairline", () => {
    expect(recipe.variants?.["variant"]?.["elevated"]).toMatchObject({
      content: { borderColor: "transparent", borderStyle: "solid", borderWidth: "hairline" },
    });
  });

  it("matches every Tour tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Tour(\.\w+)?$/u]);
  });
});
