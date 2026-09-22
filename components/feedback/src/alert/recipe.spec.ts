import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#alert/alert.specimen.tsx";
import { recipe } from "#alert/recipe.ts";

const PARTS = ["root", "indicator", "content", "title", "description", "aside"];

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("attaches a source snippet to every scene generated from axes", () => {
    const built = page.scenes.filter((scene) => scene.axes !== undefined);

    expect(built.every((scene) => scene.source !== undefined)).toBe(true);
  });

  it("references a token on every value a theme has to be able to move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Alert.Root", "Alert.Title", "Alert.Indicator"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("prefixes its generated classes with alert", () => {
    expect(recipe.className).toBe("alert");
  });

  it("declares the six slots in the order the markup nests them", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares exactly the seven variants edge through variant", () => {
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

  it("accepts only the three edges the theme draws a rule along", () => {
    expect(valuesOf(recipe, "edge")).toStrictEqual(["bottom", "end", "top"]);
  });

  it("maps edge top to the indicator.top layer style on the root slot", () => {
    expect(recipe.variants?.["edge"]?.["top"]).toStrictEqual({
      root: { layerStyle: "indicator.top" },
    });
  });

  it("defaults every variant except edge and motion", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      layout: "stacked",
      radius: "l3",
      size: "md",
      status: "info",
      variant: "subtle",
    });
  });

  it("adds neutral to the four statuses the theme emits", () => {
    expect(valuesOf(recipe, "status")).toStrictEqual([
      "error",
      "info",
      "neutral",
      "success",
      "warning",
    ]);
  });

  it("sets colorPalette to the status name and nothing else on every status", () => {
    expect.hasAssertions();

    for (const [status, styles] of Object.entries(recipe.variants?.["status"] ?? {})) {
      expect(styles).toStrictEqual({ root: { colorPalette: status } });
    }
  });

  it("accepts all five flat treatments for variant", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("accepts three size steps rather than the theme's full scale", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("scales the root's spacing and the indicator's box from a single size value", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      indicator: { boxSize: "calc({sizes.icon.md} * var(--density, 1))" },
      root: {
        gap: "calc({spacing.gap.md} * var(--density, 1))",
        padding: "calc({spacing.inset.md} * var(--density, 1))",
        textStyle: "body.md",
      },
    });
  });

  it("sets a zero minimum inline size on the content slot", () => {
    expect(recipe.base?.["content"]).toMatchObject({ minInlineSize: "0" });
  });

  it("declares no colour on the indicator slot", () => {
    expect(recipe.base?.["indicator"]).not.toHaveProperty("color");
  });

  it("matches Alert and any dotted member of it for jsx tracking", () => {
    expect(recipe.jsx).toStrictEqual([/^Alert(\.\w+)?$/u]);
  });
});
