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

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "placement", "size", "variant"]);
  });

  it("defaults to a ghost switcher at md on its own", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ placement: "alone", size: "md", variant: "ghost" });
  });

  it("declares the button's six looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "ghost",
      "outline",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
  });

  it("draws the outline look with the button's light edge", () => {
    expect(recipe.variants?.["variant"]?.["outline"]).toStrictEqual({
      root: { layerStyle: "outline.muted" },
    });
  });

  it("keeps a transparent edge on every look", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      borderColor: "transparent",
      borderWidth: "control",
    });
  });

  it("sets colorPalette on the root for each palette", () => {
    expect(recipe.variants?.["palette"]?.["accent"]).toStrictEqual({
      root: { colorPalette: "accent" },
    });
  });

  it("declares three placements", () => {
    expect(valuesOf(recipe, "placement")).toStrictEqual(["alone", "sidebar", "toolbar"]);
  });

  it("fills the column in a sidebar", () => {
    expect(recipe.variants?.["placement"]?.["sidebar"]?.["root"]).toMatchObject({
      inlineSize: "full",
    });
  });

  it("renders the mark alone without padding or edge on a rail", () => {
    expect(recipe.variants?.["placement"]?.["sidebar"]?.["root"]?.["&[data-iconic]"]).toMatchObject(
      { aspectRatio: "square", borderWidth: "0", justifyContent: "center", padding: "0" },
    );
  });

  it("fits its words on one line in a toolbar", () => {
    expect(recipe.variants?.["placement"]?.["toolbar"]).toStrictEqual({
      detail: { display: "none" },
      root: { inlineSize: "fit", minBlockSize: "var(--switcher-height)" },
    });
  });

  it("sets the switcher height to the control height at each size", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["root"]).toMatchObject({
      "--switcher-height": "calc({sizes.control.sm} * var(--density, 1))",
    });
  });

  it("sets no minimum height in a sidebar", () => {
    expect(recipe.variants?.["placement"]?.["sidebar"]?.["root"]).not.toHaveProperty(
      "minBlockSize",
    );
  });

  it("fits its words on one line on its own", () => {
    expect(recipe.variants?.["placement"]?.["alone"]).toStrictEqual(
      recipe.variants?.["placement"]?.["toolbar"],
    );
  });

  it("hides the label visually on a rail", () => {
    expect(recipe.base?.["label"]?.[".switcher__root[data-iconic] &"]).toStrictEqual({
      srOnly: true,
    });
  });

  it("hides the label visually in a narrow toolbar when the control has a mark", () => {
    expect(
      recipe.base?.["label"]?.[".switcher__root[data-narrow]:has(.switcher__mark) &"],
    ).toStrictEqual({ srOnly: true });
  });

  it("removes the indicator on a rail", () => {
    expect(recipe.base?.["indicator"]?.[".switcher__root[data-iconic] &"]).toStrictEqual({
      display: "none",
    });
  });

  it("sizes the mark to icon.lg on one line", () => {
    expect(
      recipe.compoundVariants?.find((each) => each.className === "switcher__mark--marked"),
    ).toMatchObject({
      css: { mark: { boxSize: "calc({sizes.icon.lg} * var(--density, 1))", fontSize: "xs" } },
      placement: ["alone", "toolbar"],
    });
  });

  it("sets the trigger's own ink on two parts of the solid look", () => {
    expect(recipe.compoundVariants?.filter((each) => each.variant === "solid")).toHaveLength(2);
  });

  it("sets the control's text style one size smaller than its size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      "--switcher-height": "calc({sizes.control.md} * var(--density, 1))",
      borderRadius: "l2",
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.gap.md} * var(--density, 1))",
      textStyle: "body.sm",
    });
    expect(recipe.variants?.["size"]?.["md"]?.["name"]).toStrictEqual({ textStyle: "body.sm" });
    expect(recipe.base?.["name"]).toMatchObject({ fontWeight: "medium" });
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

  it("renders the mark as a square in the palette's muted fill", () => {
    expect(recipe.base?.["mark"]).toMatchObject({
      background: "colorPalette.muted",
      borderRadius: "l1",
      color: "colorPalette.fg",
      justifyContent: "center",
    });
  });

  it("sizes the mark two control sizes smaller than the switcher", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["mark"]).toStrictEqual({
      boxSize: "calc({sizes.control.xs} * var(--density, 1))",
      fontSize: "sm",
    });
  });

  it("sets the neutral palette in the base", () => {
    expect(recipe.base?.["root"]).toMatchObject({ colorPalette: "neutral" });
  });

  it("matches every Switcher tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Switcher(\.\w+)?$/u]);
  });
});
