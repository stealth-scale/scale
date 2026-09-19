import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { interactive, link, row } from "#authoring/recipes/interactive.ts";

describe("interactive", () => {
  it("draws the hand and a fast transition of the common properties", () => {
    expect(interactive()).toMatchObject({
      cursor: "button",
      transitionDuration: "fast",
      transitionProperty: "common",
      transitionTimingFunction: "out",
      userSelect: "none",
    });
  });

  it("draws the focus ring outside the box in the palette's ring color", () => {
    expect(interactive()).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
    });
  });

  it("reads the disabled look when disabled", () => {
    expect(interactive()).toMatchObject({ _disabled: { layerStyle: "disabled" } });
  });

  it("holds the box still under a press", () => {
    expect(interactive()).not.toHaveProperty("_active");
    expect(JSON.stringify(interactive())).not.toContain("scale");
  });

  it("draws a link in the link ink with an underline on hover", () => {
    expect(link()).toMatchObject({
      _hover: { textDecoration: "underline", textUnderlineOffset: "normal" },
      color: "fg.link",
      textDecoration: "none",
    });
  });

  it("keeps the link ink once visited", () => {
    expect(link()).toMatchObject({ _visited: { color: "fg.link" } });
  });

  it("draws a row across the whole list with its content on one line", () => {
    expect(row()).toMatchObject({
      alignItems: "center",
      display: "flex",
      inlineSize: "100%",
      textAlign: "start",
    });
  });

  it("draws the arrow over a row rather than the hand", () => {
    expect(row()).toMatchObject({ cursor: "menuitem" });
  });

  it("positions a row so a mark can be placed in the gutter beside it", () => {
    expect(row()).toMatchObject({ position: "relative" });
  });

  it("leaves a row without a focus ring because the list keeps focus", () => {
    expect(row()).not.toHaveProperty("focusVisibleRing");
  });

  it("passes the recipe checks for a control and for a link", () => {
    expect(recipeViolations(defineRecipe({ base: interactive(), className: "x" }))).toStrictEqual(
      [],
    );
    expect(recipeViolations(defineRecipe({ base: link(), className: "x" }))).toStrictEqual([]);
  });

  it("passes the recipe checks for a row", () => {
    expect(recipeViolations(defineRecipe({ base: row(), className: "x" }))).toStrictEqual([]);
  });
});
