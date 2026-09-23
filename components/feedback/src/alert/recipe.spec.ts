import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#alert/alert.specimen.tsx";
import { recipe } from "#alert/recipe.ts";

const PARTS = ["root", "indicator", "content", "title", "description", "aside", "closeTrigger"];

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Alert.Root", "Alert.Title", "Alert.Indicator", "Alert.CloseTrigger"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("sets className to alert", () => {
    expect(recipe.className).toBe("alert");
  });

  it("declares seven slots in markup order", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares the edge layout motion radius size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "edge",
      "layout",
      "motion",
      "radius",
      "size",
      "status",
      "variant",
    ]);
  });

  it("declares bottom end and top on the edge axis", () => {
    expect(valuesOf(recipe, "edge")).toStrictEqual(["bottom", "end", "top"]);
  });

  it("reads the indicator.top layer style on the root for edge top", () => {
    expect(recipe.variants?.["edge"]?.["top"]).toStrictEqual({
      root: { layerStyle: "indicator.top" },
    });
  });

  it("defaults every axis except edge and motion", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      layout: "stacked",
      radius: "l3",
      size: "md",
      status: "info",
      variant: "subtle",
    });
  });

  it("declares neutral next to the four statuses", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual([
      "error",
      "info",
      "neutral",
      "success",
      "warning",
    ]);
  });

  it("sets only colorPalette on the root for each status", () => {
    expect.hasAssertions();

    for (const [status, styles] of Object.entries(recipe.variants?.["status"] ?? {})) {
      expect(styles).toStrictEqual({ root: { colorPalette: status } });
    }
  });

  it("declares the five flat looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("declares sm md and lg on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("sets the root spacing and the indicator box at md", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      indicator: { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
      root: {
        gap: "calc({spacing.gap.md} * var(--density, 1))",
        padding: "calc({spacing.inset.md} * var(--density, 1))",
        textStyle: "body.md",
      },
    });
  });

  it("stretches an svg in the indicator to its box", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ "& > svg": { boxSize: "100%" } });
  });

  it("outlines the root in CanvasText under forced colors", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      _highContrast: {
        outlineColor: "CanvasText",
        outlineStyle: "solid",
        outlineWidth: "hairline",
      },
    });
  });

  it("sets a zero minimum inline size on the content", () => {
    expect(recipe.base?.["content"]).toMatchObject({ minInlineSize: "0" });
  });

  it("sets no color on the indicator", () => {
    expect(recipe.base?.["indicator"]).not.toHaveProperty("color");
  });

  it("sizes the close trigger to at least 24px in the current ink", () => {
    expect(recipe.base?.["closeTrigger"]).toMatchObject({
      boxSize: "max({sizes.6}, 1.5em)",
      color: "currentcolor",
      focusVisibleRing: "inside",
    });
  });

  it("draws the close trigger in the contrast ink on a solid alert", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "alert__close-trigger--contrasted",
        css: {
          closeTrigger: {
            _hover: { background: "colorPalette.contrast/20" },
            focusRingColor: "colorPalette.contrast",
          },
        },
        variant: "solid",
      },
    ]);
  });

  it("matches the Alert tag and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Alert(\.\w+)?$/u]);
  });
});
