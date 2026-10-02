import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#card/card.specimen.tsx";
import { ruled } from "#card/metrics.ts";
import { recipe } from "#card/recipe.ts";

const PARTS = [
  "root",
  "media",
  "overlay",
  "header",
  "indicator",
  "title",
  "description",
  "aside",
  "content",
  "section",
  "footer",
];

describe("recipe", () => {
  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Card.Root", "Card.Header", "Card.Title", "Card.Media", "Card.Section"],
        parts: PARTS,
      }),
    ).toStrictEqual([]);
  });

  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("has no scene that writes a value the recipe does not offer", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("sets className to card", () => {
    expect(recipe.className).toBe("card");
  });

  it("declares eleven slots in the order a caller nests the parts", () => {
    expect(recipe.slots).toStrictEqual(PARTS);
  });

  it("declares twelve variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "disabled",
      "divided",
      "effect",
      "interactive",
      "justify",
      "motion",
      "orientation",
      "palette",
      "radius",
      "scrim",
      "size",
      "variant",
    ]);
  });

  it("defaults to an elevated vertical card at md", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      justify: "end",
      orientation: "vertical",
      radius: "l2",
      size: "md",
      variant: "elevated",
    });
  });

  it("declares five looks on the variant axis", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "elevated",
      "glass",
      "outline",
      "plain",
      "subtle",
    ]);
  });

  it("removes the fill the border and the shadow in the plain look", () => {
    expect(recipe.variants?.["variant"]?.["plain"]).toStrictEqual({
      root: { background: "transparent", borderColor: "transparent", boxShadow: "none" },
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

  it("lists every palette under staticCss", () => {
    expect(recipe.staticCss).toStrictEqual([
      {
        palette: [
          "primary",
          "secondary",
          "accent",
          "neutral",
          "info",
          "success",
          "warning",
          "error",
        ],
      },
    ]);
  });

  it("sets the border of an outline card in a palette to colorPalette.muted", () => {
    expect(
      recipe.compoundVariants?.find((each) => each.className === "card__root--toned"),
    ).toMatchObject({ css: { root: { borderColor: "colorPalette.muted" } }, variant: "outline" });
  });

  it("fills a subtle card in a palette with colorPalette.subtle", () => {
    expect(
      recipe.compoundVariants?.find((each) => each.className === "card__root--tinted"),
    ).toMatchObject({
      css: { root: { background: "colorPalette.subtle", borderColor: "colorPalette.muted" } },
      variant: "subtle",
    });
  });

  it("declares four sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm", "xl"]);
  });

  it("bleeds the media of a vertical card by the root's inset", () => {
    expect(recipe.variants?.["orientation"]?.["vertical"]?.["media"]).toStrictEqual({
      "&:first-child": { marginBlockStart: "calc(-1 * var(--card-inset))" },
      "&:last-child": { marginBlockEnd: "calc(-1 * var(--card-inset))" },
      marginInline: "calc(-1 * var(--card-inset))",
    });
  });

  it("positions the media of a horizontal card along the leading third", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["media"]).toMatchObject({
      inlineSize: "33%",
      insetBlock: "0",
      insetInlineStart: "0",
      position: "absolute",
    });
  });

  it("pads the start of a horizontal card past its media", () => {
    expect(recipe.variants?.["orientation"]?.["horizontal"]?.["root"]).toStrictEqual({
      "&:has(> .card__media)": { paddingInlineStart: "calc(33% + var(--card-inset))" },
    });
  });

  it("spans the indicator and the aside over the title and description rows", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({ gridColumn: "1", gridRow: "span 2" });
    expect(recipe.base?.["aside"]).toMatchObject({ gridColumn: "3", gridRow: "1 / span 2" });
  });

  it("covers the media with the overlay and places its content at the bottom", () => {
    expect(recipe.base?.["overlay"]).toMatchObject({
      inset: "0",
      justifyContent: "flex-end",
      position: "absolute",
    });
  });

  it("renders the overlay in the dark color scheme over a 64% black scrim when scrim is true", () => {
    expect(recipe.variants?.["scrim"]?.["true"]?.["overlay"]).toStrictEqual({
      backgroundImage:
        "linear-gradient(to top, {colors.blackAlpha.700}, {colors.blackAlpha.700} 50%, transparent)",
      color: "fg",
      colorScheme: "dark",
    });
  });

  it("draws no scrim in the overlay's base", () => {
    expect(recipe.base?.["overlay"]).not.toHaveProperty("backgroundImage");
  });

  it("draws the focus ring on the root when the title's link is focused", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["root"]).toMatchObject({
      "&:has(.card__title > a:focus-visible)": {
        outlineColor: "colorPalette.focusRing",
        outlineOffset: "ring",
        outlineStyle: "solid",
        outlineWidth: "ring",
      },
    });
  });

  it("positions every other link and button of an interactive card over the stretched link", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["root"]).toMatchObject({
      "& :is(a[href], button):not(.card__title > a)": { position: "relative" },
    });
  });

  it("stretches the title's link over the whole interactive card", () => {
    expect(recipe.variants?.["interactive"]?.["true"]?.["title"]).toStrictEqual({
      "& > a::after": { content: '""', inset: "0", position: "absolute" },
    });
  });

  it("lowers the opacity and removes pointer events of a disabled card", () => {
    expect(recipe.variants?.["disabled"]?.["true"]).toStrictEqual({
      root: { opacity: "disabled", pointerEvents: "none" },
    });
  });

  it("renders a full-width rule above the footer when divided", () => {
    expect(recipe.variants?.["divided"]?.["true"]?.["footer"]).toStrictEqual(ruled());
  });

  it("renders a full-width rule above the band after the header when divided", () => {
    expect(recipe.variants?.["divided"]?.["true"]?.["root"]).toStrictEqual({
      "& > .card__header + :is(.card__content, .card__section, .card__footer)": ruled(),
    });
  });

  it("renders a full-width rule above the content or the footer after a section", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "& > .card__section + :is(.card__content, .card__footer)": ruled(),
    });
  });

  it("applies the glow.lg layer style for the glow effect", () => {
    expect(recipe.variants?.["effect"]?.["glow"]).toStrictEqual({
      root: { layerStyle: "glow.lg" },
    });
  });

  it("names one class per compound on the root slot", () => {
    expect(recipe.compoundVariants?.map((each) => each.className)).toStrictEqual([
      "card__root--toned",
      "card__root--tinted",
      "card__root--lifted",
    ]);
  });

  it("matches JSX tag names in the Card namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Card(\.\w+)?$/u]);
  });
});
