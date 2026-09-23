import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#nav-list/nav-list.specimen.tsx";
import { recipe } from "#nav-list/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

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
    expect(recipe.variants?.["highlight"]?.["tint"]?.["link"]).toMatchObject({
      _currentPage: { layerStyle: "fill.muted" },
    });
  });

  it("leaves the ink of the current row to the highlight that marks it", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["link"]?.["_currentPage"]).not.toHaveProperty(
      "color",
    );
    expect(recipe.variants?.["highlight"]?.["fill"]?.["link"]).toMatchObject({
      _currentPage: { layerStyle: "fill.solid" },
    });
  });

  it("draws a row as tall as a tag with the label a step below", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["link"]).toStrictEqual({
      _currentPage: { fontWeight: "semibold" },
      blockSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "label.sm",
    });
    expect(recipe.variants?.["size"]?.["lg"]?.["trigger"]).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.tag.lg} * var(--density, 1)))",
      gap: "calc({spacing.gap.md} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.md} * var(--density, 1))",
      textStyle: "label.md",
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
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
      marginInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
      paddingBlock: "0.5",
      paddingInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
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

  it("leaves a row carrying a control or a count room for it at its end", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toStrictEqual({
      "&:has(> :is(.nav-list__action, .nav-list__badge)) > :is(.nav-list__link, .nav-list__trigger)":
        {
          paddingInlineEnd:
            "calc(calc({spacing.inset.sm} * var(--density, 1)) + calc({spacing.gap.sm} * var(--density, 1)) + calc({sizes.tag.sm} * var(--density, 1)))",
        },
    });
  });

  it("reserves that room on the axis writing the padding rather than on the base", () => {
    expect(recipe.base?.["item"]).not.toHaveProperty(
      "&:has(> :is(.nav-list__action, .nav-list__badge)) > :is(.nav-list__link, .nav-list__trigger)",
    );
  });

  it("gives that room back to a row drawn as a square", () => {
    expect(recipe.compoundVariants?.[0]?.css?.["item"]).toStrictEqual({
      "&:has(> :is(.nav-list__action, .nav-list__badge)) > :is(.nav-list__link, .nav-list__trigger)":
        { paddingInlineEnd: "0" },
    });
  });

  it("stands the count the control and the branch mark in one column", () => {
    const square = "calc({sizes.tag.sm} * var(--density, 1))";
    const room = "calc({spacing.inset.sm} * var(--density, 1))";

    expect(recipe.variants?.["size"]?.["md"]?.["action"]).toMatchObject({
      blockSize: square,
      marginInlineEnd: room,
      minInlineSize: square,
    });
    expect(recipe.variants?.["size"]?.["md"]?.["badge"]).toMatchObject({
      blockSize: square,
      marginInlineEnd: room,
      minInlineSize: square,
    });
    expect(recipe.variants?.["size"]?.["md"]?.["indicator"]).toMatchObject({
      blockSize: square,
      minInlineSize: square,
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
      "nav-list__item--squared",
      "nav-list__link--squared",
      "nav-list__action--squared",
      "nav-list__badge--squared",
      "nav-list__trigger--squared",
      "nav-list__indicator--squared",
      "nav-list__content--squared",
      "nav-list__badge--counted",
    ]);
  });

  it("compounds only where the list runs down a side", () => {
    expect.hasAssertions();

    for (const compound of recipe.compoundVariants ?? []) {
      expect(compound).toMatchObject({ variant: "list" });
    }
  });

  it("squares the rows only where a caller asked for a rail", () => {
    const squared = (recipe.compoundVariants ?? []).filter((each) =>
      (each.className ?? "").endsWith("--squared"),
    );

    expect(squared.map((each) => each["iconic"])).toStrictEqual(squared.map(() => true));
  });

  it("reads the count on the row a reader is on in the ink that mark was drawn for", () => {
    expect(recipe.compoundVariants?.at(-1)).toMatchObject({
      css: {
        badge: {
          ':is(.nav-list__link, .nav-list__trigger)[aria-current="page"] ~ &': {
            color: "colorPalette.contrast",
          },
        },
      },
      highlight: "fill",
    });
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
