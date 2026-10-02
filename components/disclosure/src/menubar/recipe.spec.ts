import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#menubar/menubar.specimen.tsx";
import { recipe } from "#menubar/recipe.ts";

const FORCED = { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" };

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Menubar"] })).toStrictEqual([]);
  });

  it("sets className to menubar", () => {
    expect(recipe.className).toBe("menubar");
  });

  it("declares four slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual(["bar", "fold", "root", "trigger"]);
  });

  it("declares two axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size"]);
  });

  it("defaults to md in the neutral palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ palette: "neutral", size: "md" });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["accent"]).toStrictEqual({
      root: { colorPalette: "accent" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("lets the root shrink to its container", () => {
    expect(recipe.base?.["root"]).toStrictEqual({
      display: "flex",
      maxInlineSize: "full",
      minInlineSize: "0",
    });
  });

  it("hides the bar while the root is crowded", () => {
    expect(recipe.base?.["bar"]).toMatchObject({ "[data-crowded] > &": { display: "none" } });
  });

  it("shows the fold trigger only while its grandparent root is crowded", () => {
    expect(recipe.base?.["fold"]).toMatchObject({
      "[data-crowded] > * > &": { display: "inline-flex" },
      display: "none",
    });
  });

  it("keeps a name at its width in a crowded row", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ flexShrink: "0", whiteSpace: "nowrap" });
  });

  it("fills a name under the pointer with the palette's subtle role", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({
      _hover: { background: "colorPalette.subtle" },
    });
  });

  it("fills a name with the palette's muted role while its menu is open", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ _open: { background: "colorPalette.muted" } });
  });

  it("fills a name with Highlight under forced colors while its menu is open", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ _open: { _highContrast: FORCED } });
  });

  it("restates the open name's forced colors under the pointer", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({
      _hover: { _open: { _highContrast: FORCED } },
    });
  });

  it("styles the fold trigger as a name", () => {
    const {
      "[data-crowded] > * > &": _crowded,
      display: _hidden,
      ...fold
    } = recipe.base?.["fold"] ?? {};
    const { display: _shown, ...trigger } = recipe.base?.["trigger"] ?? {};

    expect(fold).toStrictEqual(trigger);
  });

  it("sizes a name like a menu row", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["trigger"]).toStrictEqual({
      "& > svg": { boxSize: "calc({sizes.icon.sm} * var(--density, 1))", flexShrink: "0" },
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "body.sm",
    });
  });

  it("sizes the fold trigger like a name", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["fold"]).toStrictEqual(
      recipe.variants?.["size"]?.["lg"]?.["trigger"],
    );
  });

  it("spaces the names by the gap one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["bar"]).toStrictEqual({
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("matches every Menubar tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Menubar(\.\w+)?$/u]);
  });
});
