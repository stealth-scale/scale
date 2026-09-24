import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#switcher/recipe.ts";
import page from "#switcher/switcher.specimen.tsx";

/**
 * Slots of the switcher recipe, in declaration order.
 */
const PARTS = ["root", "mark", "label", "name", "detail", "indicator"];

describe("recipe", () => {
  it("fills the plain look in its interactive states", () => {
    expect(recipe.variants?.["variant"]?.["plain"]?.["root"]).toStrictEqual({
      _active: { background: "bg.emphasized" },
      _hover: { background: "bg.muted" },
      _open: { background: "bg.muted" },
      background: "transparent",
    });
  });

  it("fills the subtle look one step darker in its interactive states", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["root"]).toStrictEqual({
      _active: { background: "bg.emphasized" },
      _hover: { background: "bg.emphasized" },
      _open: { background: "bg.emphasized" },
      background: "bg.muted",
    });
  });

  it("writes the hover and open fills inside every look", () => {
    const looks = recipe.variants?.["variant"];

    expect([
      looks?.["outline"]?.["root"],
      looks?.["plain"]?.["root"],
      looks?.["subtle"]?.["root"],
    ]).toSatisfy((roots: ReadonlyArray<Record<string, unknown> | undefined>) =>
      roots.every((root) => root !== undefined && "_open" in root && "_hover" in root),
    );
  });

  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Switcher"], parts: PARTS })).toStrictEqual([]);
  });

  it("sets className to switcher", () => {
    expect(recipe.className).toBe("switcher");
  });

  it("declares six slots", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares three axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["placement", "size", "variant"]);
  });

  it("defaults to a plain switcher at md in a sidebar", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      placement: "sidebar",
      size: "md",
      variant: "plain",
    });
  });

  it("sizes the mark to icon.lg in a toolbar", () => {
    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "switcher__mark--marked",
        css: { mark: { boxSize: "calc({sizes.icon.lg} * var(--density, 1))", fontSize: "xs" } },
        placement: "toolbar",
      },
    ]);
  });

  it("sets the control's text style one size smaller than its size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      borderRadius: "l2",
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.gap.md} * var(--density, 1))",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["name"]).toStrictEqual({ textStyle: "body.sm" });
    expect(recipe.base?.["name"]).toMatchObject({ fontWeight: "medium" });
  });

  it("fills the column in a sidebar", () => {
    expect(recipe.variants?.["placement"]?.["sidebar"]?.["root"]).toStrictEqual({
      inlineSize: "full",
    });
  });

  it("fits its words in a toolbar", () => {
    expect(recipe.variants?.["placement"]?.["toolbar"]).toStrictEqual({
      detail: { display: "none" },
      root: { inlineSize: "fit" },
    });
  });

  it("declares three looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["outline", "plain", "subtle"]);
  });

  it("truncates the name", () => {
    expect(recipe.base?.["name"]).toMatchObject({
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    });
  });

  it("stacks the name over the detail in a column that grows", () => {
    expect(recipe.base?.["label"]).toMatchObject({
      display: "flex",
      flex: "1",
      flexDirection: "column",
    });
  });

  it("sets the detail in fg.subtle at the caption style", () => {
    expect(recipe.base?.["detail"]).toMatchObject({ color: "fg.subtle", textStyle: "caption" });
  });

  it("places the indicator at the control's end without rotating it", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _open: { rotate: "0deg" },
      alignItems: "center",
      display: "inline-flex",
      marginInlineStart: "auto",
    });
  });

  it("renders the mark as a tinted square with its content centred", () => {
    expect(recipe.base?.["mark"]).toStrictEqual({
      alignItems: "center",
      background: "bg.muted",
      borderRadius: "l1",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "semibold",
      justifyContent: "center",
      lineHeight: "tight",
      overflow: "clip",
    });
  });

  it("sizes the mark two control sizes smaller than the switcher", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["mark"]).toStrictEqual({
      boxSize: "calc({sizes.control.xs} * var(--density, 1))",
      fontSize: "sm",
    });
  });

  it("sets the control's ink to fg.muted in the neutral palette", () => {
    expect(recipe.base?.["root"]).toMatchObject({ color: "fg.muted", colorPalette: "neutral" });
  });

  it("matches every Switcher tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Switcher(\.\w+)?$/u]);
  });
});
