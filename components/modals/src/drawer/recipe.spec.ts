import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#drawer/drawer.specimen.tsx";
import { recipe } from "#drawer/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Drawer"] })).toStrictEqual([]);
  });

  it("sets className to drawer", () => {
    expect(recipe.className).toBe("drawer");
  });

  it("declares thirteen slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "actionTrigger",
      "backdrop",
      "body",
      "closeTrigger",
      "content",
      "description",
      "footer",
      "header",
      "positioner",
      "root",
      "scroller",
      "title",
      "trigger",
    ]);
  });

  it("sets display contents on the root", () => {
    expect(recipe.base?.["root"]).toStrictEqual({ display: "contents" });
  });

  it("declares the contained placement and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["contained", "placement", "size"]);
  });

  it("defaults to an extra-small panel at the end", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ placement: "end", size: "xs" });
  });

  it("orders the placements start end top bottom", () => {
    expect(Object.keys(recipe.variants?.["placement"] ?? {})).toStrictEqual([
      "start",
      "end",
      "top",
      "bottom",
    ]);
  });

  it("declares five widths with full", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["full", "lg", "md", "sm", "xl", "xs"]);
  });

  it.each([
    { size: "xs", width: "{sizes.xs}" },
    { size: "sm", width: "{sizes.md}" },
    { size: "md", width: "{sizes.lg}" },
    { size: "lg", width: "{sizes.2xl}" },
    { size: "xl", width: "{sizes.4xl}" },
    { size: "full", width: "{sizes.full}" },
  ] as const)("sets --drawer-size to $width at size $size", ({ size, width }) => {
    expect(recipe.variants?.["size"]?.[size]).toStrictEqual({
      content: { "--drawer-size": width },
    });
  });

  it("reads --drawer-size as the width at the start", () => {
    expect(recipe.variants?.["placement"]?.["start"]).toMatchObject({
      content: { maxInlineSize: "var(--drawer-size)" },
      positioner: { alignItems: "stretch", justifyContent: "flex-start" },
    });
  });

  it("reads --drawer-size as the greatest height at the bottom", () => {
    expect(recipe.variants?.["placement"]?.["bottom"]).toMatchObject({
      content: { maxBlockSize: "var(--drawer-size)" },
      positioner: { alignItems: "flex-end" },
    });
  });

  it("slides the start panel from the left and from the right under rtl", () => {
    expect(recipe.variants?.["placement"]?.["start"]).toMatchObject({
      content: {
        _open: { animationStyle: "sheet.left.in" },
        _rtl: { _open: { animationStyle: "sheet.right.in" } },
      },
    });
  });

  it("slides the end panel out to the right and to the left under rtl", () => {
    expect(recipe.variants?.["placement"]?.["end"]).toMatchObject({
      content: {
        _closed: { animationStyle: "sheet.right.out" },
        _rtl: { _closed: { animationStyle: "sheet.left.out" } },
      },
    });
  });

  it("slides the top panel in from the top", () => {
    expect(recipe.variants?.["placement"]?.["top"]).toMatchObject({
      content: { _open: { animationStyle: "sheet.top.in" } },
    });
  });

  it("insets a contained panel from the window with the roundest corner", () => {
    expect(recipe.variants?.["contained"]?.["true"]).toStrictEqual({
      content: { borderRadius: "l3" },
      positioner: { padding: "{spacing.inset.md}" },
    });
  });

  it("grows the body's scroll area to fill the panel", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({ flex: "1" });
  });

  it("moves the scroll area's focus ring inside its edge", () => {
    expect(recipe.base?.["scroller"]).toMatchObject({
      "--scroll-area-ring-offset": "calc({borderWidths.ring} * -1)",
    });
  });

  it("drops the bottom padding of a header another band follows", () => {
    expect(recipe.base?.["header"]).toMatchObject({
      "&:has(~ .drawer__footer)": { paddingBlockEnd: "0" },
      "&:has(~ .drawer__scroller)": { paddingBlockEnd: "0" },
    });
  });

  it("drops the bottom padding of a body the footer follows", () => {
    expect(recipe.base?.["body"]).toMatchObject({
      ".drawer__scroller:has(~ .drawer__footer) &": { paddingBlockEnd: "0" },
    });
  });

  it("stacks the backdrop one level under its positioner", () => {
    expect(recipe.base?.["backdrop"]).toMatchObject({
      pointerEvents: "auto",
      zIndex: "calc(calc({zIndex.modal} + var(--layer-index, 0)) - 1)",
    });
  });

  it("matches every Drawer tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Drawer(\.\w+)?$/u]);
  });
});
