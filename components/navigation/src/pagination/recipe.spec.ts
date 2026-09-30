import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#pagination/pagination.specimen.tsx";
import { recipe } from "#pagination/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Pagination"] })).toStrictEqual([]);
  });

  it("sets className to pagination", () => {
    expect(recipe.className).toBe("pagination");
  });

  it("declares six slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "ellipsis",
      "item",
      "pageText",
      "root",
      "summary",
      "trigger",
    ]);
  });

  it("declares the size axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("defaults to md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("lays the root out as a row that may shrink below its content", () => {
    expect(recipe.base?.["root"]).toStrictEqual({
      alignItems: "center",
      display: "flex",
      minInlineSize: "0",
    });
  });

  it("sets the page numbers in figures of one width", () => {
    expect(recipe.base?.["item"]).toMatchObject({ fontVariantNumeric: "tabular-nums" });
  });

  it("hides a page inside a crowded root", () => {
    expect(recipe.base?.["item"]).toMatchObject({ "[data-crowded] > &": { display: "none" } });
  });

  it("hides a mark inside a crowded root", () => {
    expect(recipe.base?.["ellipsis"]).toMatchObject({ "[data-crowded] > &": { display: "none" } });
  });

  it("hides the summary outside a crowded root", () => {
    expect(recipe.base?.["summary"]).toMatchObject({ display: "none" });
  });

  it("shows the summary inside a crowded root", () => {
    expect(recipe.base?.["summary"]).toMatchObject({ "[data-crowded] > &": { display: "block" } });
  });

  it("sets the summary as the page text sets its words", () => {
    expect(recipe.base?.["summary"]).toMatchObject(recipe.base?.["pageText"] ?? {});
  });

  it("spaces the buttons one step below the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("sizes the ellipsis as a square of the control's side", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["ellipsis"]).toStrictEqual({
      boxSize: "calc({sizes.control.lg} * var(--density, 1))",
      textStyle: "label.lg",
    });
  });

  it("sizes the summary as the page text", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["summary"]).toStrictEqual(
      recipe.variants?.["size"]?.["sm"]?.["pageText"],
    );
  });

  it("pads the page text by the gap of its size", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["pageText"]).toStrictEqual({
      paddingInline: "calc({spacing.gap.sm} * var(--density, 1))",
      textStyle: "label.sm",
    });
  });

  it("matches every Pagination tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Pagination(\.\w+)?$/u]);
  });
});
