import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { EDGE, GAP, INSET, recipe } from "#toolbar/recipe.ts";
import page from "#toolbar/toolbar.specimen.tsx";

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
        names: ["Toolbar"],
        parts: ["root", "start", "center", "end", "action", "group", "separator", "search"],
      }),
    ).toStrictEqual([]);
  });

  it("sets className to toolbar", () => {
    expect(recipe.className).toBe("toolbar");
  });

  it("declares eight slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "start",
      "center",
      "end",
      "action",
      "group",
      "separator",
      "search",
    ]);
  });

  it("keeps a group from shrinking", () => {
    expect(recipe.base?.["group"]).toStrictEqual({ flexShrink: "0" });
  });

  it("folds a secondary action to its icon on a narrow row", () => {
    expect(recipe.base?.["action"]?.["&[data-priority=secondary]"]).toMatchObject({
      "&[data-narrow]": { aspectRatio: "square" },
    });
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["radius", "size", "variant"]);
  });

  it("defaults to a plain row at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ radius: "l2", size: "md", variant: "plain" });
  });

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "surface"]);
  });

  it("pads an outlined or surface row by its gap alone", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["root"]).toMatchObject({
      [INSET]: `var(${GAP})`,
      padding: `var(${INSET})`,
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({
      [INSET]: `var(${GAP})`,
      padding: `var(${INSET})`,
    });
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).not.toHaveProperty("padding");
  });

  it("covers the row's edge while the search is open", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).toMatchObject({
      inset: `calc(var(${EDGE}, 0px) * -1)`,
      position: "absolute",
    });
  });

  it("covers the row's padding while the search is open", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).not.toHaveProperty("padding");
  });

  it("stretches the opened field to the row's height", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).toMatchObject({ alignItems: "stretch" });
  });

  it("sets the edge width on an outlined or surface row", () => {
    expect(recipe.variants?.["variant"]?.["outline"]?.["root"]).toMatchObject({
      [EDGE]: "{borderWidths.hairline}",
    });
    expect(recipe.variants?.["variant"]?.["surface"]?.["root"]).toMatchObject({
      [EDGE]: "{borderWidths.hairline}",
    });
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).not.toHaveProperty(EDGE);
  });

  it("hides the row's other children while the search is open", () => {
    expect(recipe.base?.["root"]?.["&:has(.toolbar__search[data-opened])"]).toStrictEqual({
      "& > :not(.toolbar__search)": { visibility: "hidden" },
    });
  });

  it("grows the field of an opened search alone", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]?.["& > :first-child"]).toStrictEqual({
      flex: "1",
    });
  });

  it("sets the gap of its size as one property every band reads", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      [GAP]: "{spacing.gap.md}",
    });
    expect(recipe.variants?.["size"]?.["sm"]?.["root"]).toStrictEqual({
      [GAP]: "{spacing.gap.sm}",
    });
    expect(recipe.base?.["start"]).toMatchObject({ gap: `var(${GAP})` });
  });

  it("truncates a long centre", () => {
    expect(recipe.base?.["center"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("pushes the end band to the row's end", () => {
    expect(recipe.base?.["end"]).toMatchObject({ marginInlineStart: "auto" });
  });

  it("sets the search to 15rem that shrinks without growing", () => {
    expect(recipe.base?.["search"]).toMatchObject({
      flex: "0 1 auto",
      inlineSize: "60",
      minInlineSize: "0",
    });
  });

  it("sizes an opened search by its insets", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).toMatchObject({ inlineSize: "auto" });
  });

  it("lays an opened search over the row's other controls", () => {
    expect(recipe.base?.["search"]?.["&[data-opened]"]).toMatchObject({ zIndex: "1" });
  });

  it("stretches the rule to the row's height", () => {
    expect(recipe.base?.["separator"]).toMatchObject({ alignSelf: "stretch" });
  });

  it("matches every Toolbar tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Toolbar(\.\w+)?$/u]);
  });
});
