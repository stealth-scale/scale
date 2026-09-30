import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";
import { dense } from "@stealthscale/theme/authoring";

import {
  BAR,
  FADE,
  INSET,
  PAD,
  recipe,
  RING_OFFSET,
  RING_STYLE,
  THUMB,
} from "#scroll-area/recipe.ts";
import page from "#scroll-area/scroll-area.specimen.tsx";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(
      uncovered(recipe, page.scenes, {
        skip: { scrolls: "The notes, the topics and the palettes render one value each." },
      }),
    ).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["ScrollArea"] })).toStrictEqual([]);
  });

  it("sets className to scroll-area", () => {
    expect(recipe.className).toBe("scroll-area");
  });

  it("declares the six parts of the machine", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "corner",
      "root",
      "scrollbar",
      "thumb",
      "viewport",
    ]);
  });

  it("declares six axes", () => {
    expect(axesOf(recipe)).toStrictEqual([
      "fade",
      "inset",
      "maxHeight",
      "scrolls",
      "size",
      "variant",
    ]);
  });

  it("defaults to a vertical area with medium bars shown under the pointer", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ scrolls: "vertical", size: "md", variant: "hover" });
  });

  it("keeps the content of a vertical area as wide as the viewport", () => {
    expect(recipe.variants?.["scrolls"]?.["vertical"]).toStrictEqual({
      content: { minInlineSize: "0" },
    });
  });

  it("grows the content of an area that scrolls sideways to its widest child", () => {
    expect([
      recipe.variants?.["scrolls"]?.["horizontal"],
      recipe.variants?.["scrolls"]?.["both"],
    ]).toStrictEqual([
      { content: { minInlineSize: "fit-content" } },
      { content: { minInlineSize: "fit-content" } },
    ]);
  });

  it("hides the browser's scrollbars on the viewport", () => {
    expect(recipe.base?.["viewport"]).toMatchObject({
      "&::-webkit-scrollbar": { display: "none" },
      scrollbarWidth: "none",
    });
  });

  it("scrolls the viewport in both axes", () => {
    expect(recipe.base?.["viewport"]?.["overflow"]).toBe("auto");
  });

  it("scrolls a focused child a focus ring past the viewport's edge", () => {
    expect(recipe.base?.["viewport"]?.["scrollPadding"]).toBe(
      "calc(var(--focus-ring-offset, 0px) + var(--focus-ring-width, 0px))",
    );
  });

  it("rings the root while its viewport has keyboard focus", () => {
    expect(recipe.base?.["root"]?.["&:has(> .scroll-area__viewport:focus-visible)"]).toMatchObject({
      outlineColor: "border.focus",
      outlineWidth: "ring",
    });
  });

  it("places the ring outside the root's edge unless a composer moves it", () => {
    expect(
      recipe.base?.["root"]?.["&:has(> .scroll-area__viewport:focus-visible)"]?.["outlineOffset"],
    ).toBe(`var(${RING_OFFSET}, {spacing.ring})`);
  });

  it("draws the ring solid unless a composer sets its style", () => {
    expect(
      recipe.base?.["root"]?.["&:has(> .scroll-area__viewport:focus-visible)"]?.["outlineStyle"],
    ).toBe(`var(${RING_STYLE}, solid)`);
  });

  it("hides a vertical bar while the vertical axis fits", () => {
    expect(
      recipe.base?.["scrollbar"]?.["&[data-orientation=vertical]:not([data-overflow-y])"],
    ).toStrictEqual({ display: "none" });
  });

  it("hides a horizontal bar while the horizontal axis fits", () => {
    expect(
      recipe.base?.["scrollbar"]?.["&[data-orientation=horizontal]:not([data-overflow-x])"],
    ).toStrictEqual({ display: "none" });
  });

  it("pads the thumb inside its bar by the root's inset", () => {
    expect(recipe.base?.["scrollbar"]?.["padding"]).toBe(`var(${INSET})`);
  });

  it("fills the thumb with border.emphasized", () => {
    expect(recipe.base?.["scrollbar"]?.[THUMB]).toBe("{colors.border.emphasized}");
  });

  it("darkens the thumb to fg.subtle while the pointer is over the bar", () => {
    expect(recipe.base?.["scrollbar"]?.["&:is(:hover, :active)"]).toStrictEqual({
      [THUMB]: "{colors.fg.subtle}",
    });
  });

  it("fills the thumb with CanvasText under forced colors", () => {
    expect(recipe.base?.["scrollbar"]?.["_highContrast"]).toMatchObject({
      [THUMB]: "CanvasText",
    });
  });

  it("sets a thumb's thickness from 4px at xs to 12px at lg", () => {
    expect([
      recipe.variants?.["size"]?.["xs"]?.["root"]?.[BAR],
      recipe.variants?.["size"]?.["lg"]?.["root"]?.[BAR],
    ]).toStrictEqual(["{sizes.1}", "{sizes.3}"]);
  });

  it("pads the content from the inset scale", () => {
    expect(recipe.variants?.["inset"]?.["md"]).toStrictEqual({
      content: { [PAD]: dense("{spacing.inset.md}"), padding: `var(${PAD})` },
    });
  });

  it("stops the viewport's height at the named size", () => {
    expect(recipe.variants?.["maxHeight"]?.["sm"]).toStrictEqual({
      viewport: { maxBlockSize: "sm" },
    });
  });

  it("hides a hover bar at rest", () => {
    expect(recipe.variants?.["variant"]?.["hover"]?.["scrollbar"]).toMatchObject({ opacity: "0" });
  });

  it("shows a hover bar while hovered or scrolling or with focus inside", () => {
    expect(
      recipe.variants?.["variant"]?.["hover"]?.["scrollbar"]?.[
        "&:is([data-hover], [data-scrolling], :focus-within > *)"
      ],
    ).toMatchObject({ opacity: "1" });
  });

  it("shows an always bar at rest", () => {
    expect(recipe.variants?.["variant"]?.["always"]?.["scrollbar"]).toStrictEqual({ opacity: "1" });
  });

  it("keeps the content clear of a vertical bar that always shows", () => {
    expect(
      recipe.variants?.["variant"]?.["always"]?.["content"]?.["&[data-overflow-y]"],
    ).toStrictEqual({
      paddingInlineEnd: `max(var(${PAD}, 0px), calc(var(${BAR}) + var(${INSET}) * 2))`,
    });
  });

  it("keeps the content clear of a horizontal bar that always shows", () => {
    expect(
      recipe.variants?.["variant"]?.["always"]?.["content"]?.["&[data-overflow-x]"],
    ).toStrictEqual({
      paddingBlockEnd: `max(var(${PAD}, 0px), calc(var(${BAR}) + var(${INSET}) * 2))`,
    });
  });

  it("lists hover before always", () => {
    expect(Object.keys(recipe.variants?.["variant"] ?? {})).toStrictEqual(["hover", "always"]);
  });

  it("fades the viewport's edges over the machine's overflow properties", () => {
    expect(recipe.variants?.["fade"]?.["true"]?.["viewport"]?.["maskImage"]).toContain(
      `min(var(${FADE}), var(--scroll-area-overflow-y-start, 0px))`,
    );
  });

  it("starts the horizontal fade at the right edge under rtl", () => {
    expect(
      recipe.variants?.["fade"]?.["true"]?.["viewport"]?.["&:dir(rtl)"]?.["maskImage"],
    ).toContain("linear-gradient(to left");
  });

  it("matches every ScrollArea tag", () => {
    expect(recipe.jsx).toStrictEqual([/^ScrollArea(\.\w+)?$/u]);
  });
});
