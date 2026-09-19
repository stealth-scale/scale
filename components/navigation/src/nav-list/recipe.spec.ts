import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#nav-list/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["NavList"],
        parts: [
          "root",
          "item",
          "link",
          "action",
          "badge",
          "branch",
          "trigger",
          "indicator",
          "content",
          "skeleton",
        ],
      }),
    ).toStrictEqual([]);
  });

  it("names its class nav-list", () => {
    expect(recipe.className).toBe("nav-list");
  });

  it("styles the ten parts a navigation list draws", () => {
    expect(recipe.slots).toHaveLength(10);
  });

  it("offers the six axes a navigation list takes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "highlight",
      "iconic",
      "radius",
      "reveal",
      "size",
      "variant",
    ]);
  });

  it("tints the current row at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      highlight: "tint",
      radius: "l2",
      reveal: "always",
      size: "md",
      variant: "list",
    });
  });

  it("offers the three ways the current row is marked", () => {
    expect(valuesOf(recipe, "highlight")).toStrictEqual(["bar", "fill", "tint"]);
  });

  it("marks the current row from the attribute a screen reader reads", () => {
    expect(recipe.variants?.["highlight"]?.["tint"]?.["link"]).toStrictEqual({
      _currentPage: { layerStyle: "fill.muted" },
    });
  });

  it("draws a row as tall as a tag with the label two steps below", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["link"]).toStrictEqual({
      _currentPage: { color: "fg", fontWeight: "semibold" },
      blockSize: "tag.md",
      gap: "gap.xs",
      paddingInline: "inset.xs",
      textStyle: "label.xs",
    });
    expect(recipe.variants?.["size"]?.["lg"]?.["trigger"]).toMatchObject({
      blockSize: "tag.lg",
      gap: "gap.sm",
      paddingInline: "inset.sm",
      textStyle: "label.sm",
    });
  });

  it("sets a group's row in the palette's own ink and leaves a hover to the surface", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ color: "colorPalette.fg" });
    expect(recipe.base?.["link"]).toMatchObject({
      _hover: { background: "colorPalette.subtle" },
    });
  });

  it("indents a nested list by the inset a step below and airs its rows a little more", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["content"]).toStrictEqual({
      gap: "gap.sm",
      marginInlineStart: "inset.sm",
      paddingBlock: "0.5",
      paddingInlineStart: "inset.sm",
    });
  });

  it("draws the control beside a row until a caller asks for less", () => {
    expect(recipe.variants?.["reveal"]?.["always"]?.["action"]).toStrictEqual({ opacity: "1" });
  });

  it("names the foot of a dock apart from the bar the highlight offers", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["dock", "list"]);
    expect(valuesOf(recipe, "highlight")).toContain("bar");
  });

  it("keeps a dock clear of the room a device reserves at the foot of the screen", () => {
    expect(recipe.variants?.["variant"]?.["dock"]?.["root"]).toMatchObject({
      paddingBlockEnd: "safe.bottom",
    });
  });

  it("keeps a revealed control drawn under a coarse pointer", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["action"]).toMatchObject({
      _touch: { opacity: "1" },
    });
  });

  it("draws a revealed control while a keyboard stands anywhere in its row", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["item"]).toStrictEqual({
      "&:focus-within .nav-list__action, &:hover .nav-list__action": { opacity: "1" },
    });
  });

  it("reaches another part by the class its binding writes rather than by a part attribute", () => {
    expect(JSON.stringify(recipe)).not.toContain("data-part");
  });

  it("squares one class per part it changes in the order the slots are named", () => {
    expect(recipe.compoundVariants?.map((each) => each.className)).toStrictEqual([
      "nav-list__link--squared",
      "nav-list__action--squared",
      "nav-list__badge--squared",
      "nav-list__trigger--squared",
      "nav-list__indicator--squared",
      "nav-list__content--squared",
    ]);
  });

  it("squares the rows only where the list runs down a side", () => {
    expect.hasAssertions();

    for (const compound of recipe.compoundVariants ?? []) {
      expect(compound).toMatchObject({ iconic: true, variant: "list" });
    }
  });

  it("keeps a collapsed row's words for a screen reader rather than clipping them", () => {
    expect.hasAssertions();

    for (const pressable of ["link", "trigger"]) {
      const squared = recipe.compoundVariants?.find(
        (each) => each.className === `nav-list__${pressable}--squared`,
      );

      expect(squared?.css).toMatchObject({ [pressable]: { "& > :not(svg)": { srOnly: true } } });
    }
  });

  it("takes a nested list out of the tab order while its branch is closed", () => {
    expect(recipe.base?.["content"]?.["&[hidden]"]).toStrictEqual({ display: "none" });
  });

  it("mutes a nested row through the list that holds it rather than through a part", () => {
    expect(recipe.base?.["content"]).toMatchObject({ color: "fg.muted" });
  });

  it("tracks every tag under the NavList namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^NavList(\.\w+)?$/u]);
  });
});
