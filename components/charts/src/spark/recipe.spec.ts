import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#spark/recipe.ts";
import page from "#sparkline/sparkline.specimen.tsx";

describe("recipe", () => {
  it("covers every variant axis in the scenes of the sparkline's specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Sparkbar", "Sparkline"] })).toStrictEqual([]);
  });

  it("sets className to spark", () => {
    expect(recipe.className).toBe("spark");
  });

  it("declares the size and stretch axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "stretch"]);
  });

  it("offers the small the middle and the large size", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("defaults to the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("sizes the middle box from the grid four times as wide as it is tall", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      blockSize: "calc({sizes.6} * var(--density, 1))",
      inlineSize: "calc({sizes.24} * var(--density, 1))",
    });
  });

  it("fills the container's width when stretched", () => {
    expect(recipe.variants?.["stretch"]?.["true"]).toStrictEqual({
      display: "flex",
      inlineSize: "full",
    });
  });

  it("sets the baseline in the subtle ink", () => {
    expect(recipe.base).toMatchObject({
      "& .recharts-reference-line line": { stroke: "fg.subtle" },
    });
  });

  it("sets the baseline in CanvasText under forced colors", () => {
    expect(recipe.base).toMatchObject({
      "& .recharts-reference-line line": { _highContrast: { stroke: "CanvasText" } },
    });
  });

  it("matches the Sparkline and Sparkbar tags", () => {
    expect(recipe.jsx).toStrictEqual([/^Spark(bar|line)$/u]);
  });
});
