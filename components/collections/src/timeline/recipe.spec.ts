import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { INDICATOR, recipe } from "#timeline/recipe.ts";
import page from "#timeline/timeline.specimen.tsx";

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
        names: ["Timeline.Root"],
        parts: ["root", "item", "connector", "indicator", "content", "title", "description"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to timeline", () => {
    expect(recipe.className).toBe("timeline");
  });

  it("declares ongoing palette rail size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["ongoing", "palette", "rail", "size", "variant"]);
  });

  it("defaults to neutral solid indicators at the middle size with the rail at the start", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "neutral",
      rail: "start",
      size: "md",
      variant: "solid",
    });
  });

  it("declares sm to xl on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl"]);
  });

  it("sizes the indicator from the icon scale", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toMatchObject({
      [INDICATOR]: "calc({sizes.icon.md} * var(--density, 1))",
    });
  });

  it("gives the words on both sides of a centred rail an equal share", () => {
    expect(recipe.variants?.["rail"]?.["center"]).toStrictEqual({
      root: { gridTemplateColumns: `minmax(0, 1fr) var(${INDICATOR}) minmax(0, 1fr)` },
    });
  });

  it("lays each item across the root's columns as a subgrid row", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      gridColumn: "1 / -1",
      gridTemplateColumns: "subgrid",
    });
  });

  it("stops the rail at the last indicator", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      "&:last-child > .timeline__connector::before": { display: "none" },
    });
  });

  it("draws the rail past the last indicator when ongoing", () => {
    expect(recipe.variants?.["ongoing"]?.["true"]).toMatchObject({
      item: { "&:last-child > .timeline__connector::before": { display: "block" } },
    });
  });

  it("aligns the words before the rail to the rail", () => {
    expect(recipe.base?.["content"]).toMatchObject({
      "&:has(+ .timeline__connector)": { alignItems: "flex-end", textAlign: "end" },
    });
  });

  it("fills the indicator with the panel's ground and rings it", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      backgroundColor: "bg.panel",
      outlineColor: "bg.panel",
      outlineStyle: "solid",
    });
  });

  it("centres a one-line title on the indicator", () => {
    expect(recipe.base?.["title"]).toMatchObject({
      alignItems: "center",
      minBlockSize: `var(${INDICATOR})`,
    });
  });
});
