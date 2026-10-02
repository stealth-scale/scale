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

  it("references a token on every value a theme has to be able to move", () => {
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

  it("sets className to nav-list", () => {
    expect(recipe.className).toBe("nav-list");
  });

  it("declares ten slots", () => {
    expect(recipe.slots).toHaveLength(10);
  });

  it("declares nine variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "effect",
      "guide",
      "highlight",
      "iconic",
      "palette",
      "radius",
      "reveal",
      "size",
      "variant",
    ]);
  });

  it("defaults to the tint highlight at the md size in the list variant", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      guide: "solid",
      highlight: "tint",
      radius: "l2",
      reveal: "always",
      size: "md",
      variant: "list",
    });
  });

  it("declares bar fill and tint on the highlight axis", () => {
    expect(valuesOf(recipe, "highlight")).toStrictEqual(["bar", "fill", "tint"]);
  });

  it("marks the current row through the _currentPage condition", () => {
    expect(recipe.variants?.["highlight"]?.["tint"]?.["link"]).toMatchObject({
      _currentPage: { layerStyle: "fill.muted" },
    });
  });

  it("writes no color for the current row on the size axis", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["link"]?.["_currentPage"]).not.toHaveProperty(
      "color",
    );
  });

  it("marks the current row with the fill.solid layer style for the fill highlight", () => {
    expect(recipe.variants?.["highlight"]?.["fill"]?.["link"]).toMatchObject({
      _currentPage: { layerStyle: "fill.solid" },
    });
  });

  it("declares the eight semantic palettes on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "error",
      "info",
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
    ]);
  });

  it("sets colorPalette on the root for each palette", () => {
    expect(recipe.variants?.["palette"]?.["accent"]).toStrictEqual({
      root: { colorPalette: "accent" },
    });
  });

  it("declares glow on the effect axis", () => {
    expect(valuesOf(recipe, "effect")).toStrictEqual(["glow"]);
  });

  it("glows the current link and trigger with the glow.sm layer style", () => {
    expect(recipe.variants?.["effect"]?.["glow"]).toStrictEqual({
      link: { _currentPage: { layerStyle: "glow.sm" } },
      trigger: { _currentPage: { layerStyle: "glow.sm" } },
    });
  });

  it("sizes a middle row as the smallest control with the label two steps below", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["link"]).toStrictEqual({
      _currentPage: { fontWeight: "semibold" },
      "& > svg": { boxSize: "calc({sizes.icon.sm} * var(--density, 1))", flexShrink: "0" },
      blockSize: "max({sizes.6}, calc({sizes.control.xs} * var(--density, 1)))",
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.xs} * var(--density, 1))",
      textStyle: "label.xs",
    });
  });

  it("sizes a small row as a middle tag", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["link"]).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))",
    });
  });

  it("sizes a large trigger as a middle control with the sm label inset and gap", () => {
    expect(recipe.variants?.["size"]?.["lg"]?.["trigger"]).toMatchObject({
      blockSize: "max({sizes.6}, calc({sizes.control.md} * var(--density, 1)))",
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "label.sm",
    });
  });

  it("sets fg.muted on the root for its rows to inherit", () => {
    expect(recipe.base?.["root"]).toMatchObject({ color: "fg.muted" });
  });

  it("sets the trigger ink to the inherited ink", () => {
    expect(recipe.base?.["trigger"]).toMatchObject({ color: "inherit" });
  });

  it("sets fg on the current row in the base", () => {
    expect(recipe.base?.["link"]).toMatchObject({ _currentPage: { color: "fg" } });
  });

  it("fills a hovered link with colorPalette.subtle", () => {
    expect(recipe.base?.["link"]).toMatchObject({
      _hover: { background: "colorPalette.subtle" },
    });
  });

  it("indents a nested list by the row inset", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["content"]).toStrictEqual({
      gap: "calc({spacing.gap.xs} * var(--density, 1))",
      marginInlineStart: "calc({spacing.inset.xs} * var(--density, 1))",
      paddingBlock: "0.5",
      paddingInlineStart: "calc({spacing.inset.sm} * var(--density, 1))",
    });
  });

  it("shows the control at full opacity when reveal is always", () => {
    expect(recipe.variants?.["reveal"]?.["always"]?.["action"]).toStrictEqual({ opacity: "1" });
  });

  it("declares dock and list on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual(["dock", "list"]);
  });

  it("pads the dock root by the bottom safe area", () => {
    expect(recipe.variants?.["variant"]?.["dock"]?.["root"]).toMatchObject({
      paddingBlockEnd: "safe.bottom",
    });
  });

  it("shows a revealed control under a coarse pointer", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["action"]).toMatchObject({
      _touch: { opacity: "1" },
    });
  });

  it("reserves end padding on a row that contains a control or a count", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["item"]).toStrictEqual({
      "&:has(> :is(.nav-list__action, .nav-list__badge)) > :is(.nav-list__link, .nav-list__trigger)":
        {
          paddingInlineEnd:
            "calc(calc({spacing.inset.xs} * var(--density, 1)) + calc({spacing.gap.xs} * var(--density, 1)) + max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1))))",
        },
    });
  });

  it("writes the end padding rule on the size axis and not in the item base", () => {
    expect(recipe.base?.["item"]).not.toHaveProperty(
      "&:has(> :is(.nav-list__action, .nav-list__badge)) > :is(.nav-list__link, .nav-list__trigger)",
    );
  });

  it("removes the end padding from a row in the iconic list", () => {
    expect(recipe.compoundVariants?.[0]?.css?.["item"]).toStrictEqual({
      "&:has(> :is(.nav-list__action, .nav-list__badge)) > :is(.nav-list__link, .nav-list__trigger)":
        { paddingInlineEnd: "0" },
    });
  });

  it("sizes the count the control and the indicator to the same square", () => {
    const square = "max({sizes.6}, calc({sizes.tag.sm} * var(--density, 1)))";
    const room = "calc({spacing.inset.xs} * var(--density, 1))";

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

  it("shows a revealed control on a focused or hovered or current row", () => {
    expect(recipe.variants?.["reveal"]?.["hover"]?.["item"]).toStrictEqual({
      '&:focus-within .nav-list__action, &:hover .nav-list__action, &:has(> :is(.nav-list__link, .nav-list__trigger)[aria-current="page"]) .nav-list__action':
        { opacity: "1" },
    });
  });

  it("removes the inline padding from a squared link", () => {
    expect(recipe.compoundVariants?.[1]?.css?.["link"]).toMatchObject({ paddingInline: "0" });
  });

  it("renders the control as an unfilled borderless button", () => {
    expect(recipe.base?.["action"]).toMatchObject({
      appearance: "none",
      background: "transparent",
      borderStyle: "none",
      padding: "0",
    });
  });

  it("fills a hovered control with colorPalette.emphasized", () => {
    expect(recipe.base?.["action"]).toMatchObject({
      _hover: { background: "colorPalette.emphasized", color: "fg" },
    });
  });

  it("keeps the row fill while the pointer is on its control", () => {
    expect(recipe.base?.["item"]).toMatchObject({
      "&:has(> .nav-list__action:hover) > :is(.nav-list__link, .nav-list__trigger)": {
        background: "colorPalette.subtle",
      },
    });
  });

  it("sets the control beside the current row to colorPalette.contrast", () => {
    expect(
      recipe.compoundVariants?.find((each) => each.className === "nav-list__action--inked")?.css?.[
        "action"
      ],
    ).toStrictEqual({
      ':is(.nav-list__link, .nav-list__trigger)[aria-current="page"] ~ &': {
        _hover: { background: "colorPalette.solid.hover", color: "colorPalette.contrast" },
        color: "colorPalette.contrast",
      },
    });
  });

  it("declares dashed dotted none solid on the guide axis", () => {
    expect(valuesOf(recipe, "guide")).toStrictEqual(["dashed", "dotted", "none", "solid"]);
  });

  it("sets the start border style of the nested list for each guide", () => {
    expect(recipe.variants?.["guide"]?.["dotted"]).toStrictEqual({
      content: { borderInlineStartStyle: "dotted" },
    });
  });

  it("centres the guide on the trigger icon when the trigger leads with one", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["branch"]).toStrictEqual({
      "&:has(> .nav-list__trigger > svg:first-child) > .nav-list__content": {
        marginInlineStart:
          "calc(calc({spacing.inset.xs} * var(--density, 1)) + calc({sizes.icon.sm} * var(--density, 1)) / 2 - {borderWidths.hairline} / 2)",
      },
    });
  });

  it("stretches each dock destination to an equal share of the row", () => {
    expect(recipe.variants?.["variant"]?.["dock"]?.["item"]).toMatchObject({
      flex: "1",
      minInlineSize: "0",
    });
  });

  it("marks the current dock destination by fg without a fill", () => {
    expect(recipe.variants?.["variant"]?.["dock"]?.["link"]).toMatchObject({
      _currentPage: { background: "transparent", color: "fg" },
    });
  });

  it("sizes a dock icon to the large icon box", () => {
    expect(recipe.variants?.["variant"]?.["dock"]?.["link"]).toMatchObject({
      "& > svg": { boxSize: "calc({sizes.icon.lg} * var(--density, 1))" },
    });
  });

  it("selects other parts by class and never by data-part", () => {
    expect(JSON.stringify(recipe)).not.toContain("data-part");
  });

  it("names one class per part for each compound in slot order", () => {
    expect(recipe.compoundVariants?.map((each) => each.className)).toStrictEqual([
      "nav-list__item--squared",
      "nav-list__link--squared",
      "nav-list__action--squared",
      "nav-list__badge--squared",
      "nav-list__trigger--squared",
      "nav-list__indicator--squared",
      "nav-list__content--squared",
      "nav-list__action--inked",
      "nav-list__badge--inked",
    ]);
  });

  it("applies every compound only in the list variant", () => {
    expect.hasAssertions();

    for (const compound of recipe.compoundVariants ?? []) {
      expect(compound).toMatchObject({ variant: "list" });
    }
  });

  it("applies the squared compounds only when iconic is true", () => {
    const squared = (recipe.compoundVariants ?? []).filter((each) =>
      (each.className ?? "").endsWith("--squared"),
    );

    expect(squared.map((each) => each["iconic"])).toStrictEqual(squared.map(() => true));
  });

  it("sets the count next to the current row to colorPalette.contrast for the fill highlight", () => {
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

  it("hides a squared row's text visually with srOnly", () => {
    expect.hasAssertions();

    for (const pressable of ["link", "trigger"]) {
      const squared = recipe.compoundVariants?.find(
        (each) => each.className === `nav-list__${pressable}--squared`,
      );

      expect(squared?.css).toMatchObject({ [pressable]: { "& > :not(svg)": { srOnly: true } } });
    }
  });

  it("hides a closed nested list with display none", () => {
    expect(recipe.base?.["content"]?.["&[hidden]"]).toStrictEqual({ display: "none" });
  });

  it("sets fg.subtle on a nested list for its rows to inherit", () => {
    expect(recipe.base?.["content"]).toMatchObject({ color: "fg.subtle" });
  });

  it("matches JSX tag names in the NavList namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^NavList(\.\w+)?$/u]);
  });
});
