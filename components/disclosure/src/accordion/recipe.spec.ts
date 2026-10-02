import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#accordion/accordion.specimen.tsx";
import { recipe } from "#accordion/recipe.ts";

describe("recipe", () => {
  it("covers every axis in the scenes of its specimen", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene naming a value the recipe lacks", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Accordion"] })).toStrictEqual([]);
  });

  it("sets className to accordion", () => {
    expect(recipe.className).toBe("accordion");
  });

  it("declares seven slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "item",
      "itemBody",
      "itemContent",
      "itemHeading",
      "itemIndicator",
      "itemTrigger",
      "root",
    ]);
  });

  it("declares four axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["motion", "palette", "size", "variant"]);
  });

  it("defaults to flushed items at md in neutral sliding open", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      motion: "slide",
      palette: "neutral",
      size: "md",
      variant: "flushed",
    });
  });

  it("declares three sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("declares five looks", () => {
    expect(valuesOf(recipe, "variant")).toStrictEqual([
      "flushed",
      "outline",
      "plain",
      "subtle",
      "surface",
    ]);
  });

  it("declares three motions", () => {
    expect(valuesOf(recipe, "motion")).toStrictEqual(["fade", "none", "slide"]);
  });

  it("sets the palette on the root", () => {
    expect(recipe.variants?.["palette"]?.["warning"]).toStrictEqual({
      root: { colorPalette: "warning" },
    });
  });

  it("emits every palette", () => {
    expect(recipe.staticCss).toContainEqual({
      palette: ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"],
    });
  });

  it("sizes the trigger at least a control's height with the gap one step below as padding", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemTrigger"]).toMatchObject({
      minBlockSize: "calc({sizes.control.md} * var(--density, 1))",
      paddingBlock: "calc({spacing.gap.sm} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.md} * var(--density, 1))",
      textStyle: "label.md",
    });
  });

  it("sizes a leading icon one step below the indicator", () => {
    expect(recipe.variants?.["size"]?.["lg"]).toMatchObject({
      itemIndicator: { boxSize: "calc({sizes.icon.lg} * var(--density, 1))" },
      itemTrigger: { "& > svg": { boxSize: "calc({sizes.icon.md} * var(--density, 1))" } },
    });
  });

  it("pads the body from the size and sets its text", () => {
    expect(recipe.variants?.["size"]?.["sm"]?.["itemBody"]).toStrictEqual({
      paddingBlockEnd: "calc({spacing.inset.sm} * var(--density, 1))",
      paddingBlockStart: "calc({spacing.gap.xs} * var(--density, 1))",
      paddingInline: "calc({spacing.inset.sm} * var(--density, 1))",
      textStyle: "body.sm",
    });
  });

  it("gives a heading with a second child an end inset one step below the size", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemHeading"]).toStrictEqual({
      "&:has(> :nth-child(2))": {
        paddingInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
      },
      gap: "calc({spacing.gap.md} * var(--density, 1))",
    });
  });

  it("removes the trigger's end inset when a child follows it", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["itemTrigger"]).toMatchObject({
      "&:not(:last-child)": { paddingInlineEnd: "0" },
    });
  });

  it.each([{ look: "flushed" }, { look: "plain" }] as const)(
    "removes the inline inset in the $look look",
    ({ look }) => {
      expect(recipe.variants?.["variant"]?.[look]).toMatchObject({
        itemBody: { paddingInline: "0" },
        itemHeading: { "&:has(> :nth-child(2))": { paddingInlineEnd: "0" } },
        itemTrigger: { paddingInline: "0" },
      });
    },
  );

  it("rules a hairline under every flushed item", () => {
    expect(recipe.variants?.["variant"]?.["flushed"]?.["item"]).toStrictEqual({
      borderBlockEndColor: "colorPalette.muted",
      borderBlockEndWidth: "hairline",
    });
  });

  it.each([{ look: "outline" }, { look: "surface" }] as const)(
    "rules no hairline under the last item in the $look look",
    ({ look }) => {
      expect(recipe.variants?.["variant"]?.[look]?.["item"]).toMatchObject({
        _last: { borderBlockEndWidth: "0" },
        borderBlockEndWidth: "hairline",
      });
    },
  );

  it.each([{ look: "outline" }, { look: "surface" }] as const)(
    "clips the root to its corners in the $look look",
    ({ look }) => {
      expect(recipe.variants?.["variant"]?.[look]?.["root"]).toMatchObject({ overflow: "clip" });
    },
  );

  it.each([{ look: "outline" }, { look: "subtle" }, { look: "surface" }] as const)(
    "places the focus ring inside the trigger in the $look look",
    ({ look }) => {
      expect(recipe.variants?.["variant"]?.[look]?.["itemTrigger"]).toMatchObject({
        _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      });
    },
  );

  it("fills the open subtle item from the palette", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["item"]).toStrictEqual({
      _open: { background: "colorPalette.subtle" },
      borderRadius: "l2",
    });
  });

  it("squares the end corners of an open subtle trigger", () => {
    expect(recipe.variants?.["variant"]?.["subtle"]?.["itemTrigger"]).toMatchObject({
      _open: { borderEndEndRadius: "0", borderEndStartRadius: "0" },
    });
  });

  it("animates slide with the theme's collapse styles", () => {
    expect(recipe.variants?.["motion"]?.["slide"]).toStrictEqual({
      itemContent: {
        _closed: { animationStyle: "collapse.out" },
        _open: { animationStyle: "collapse.in" },
      },
    });
  });

  it("clips the content's overflow", () => {
    expect(recipe.base?.["itemContent"]).toStrictEqual({ overflow: "hidden" });
  });

  it("turns the indicator 180deg while open", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({ _open: { rotate: "180deg" } });
  });

  it("removes the indicator's transition under reduced motion", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "none" },
    });
  });

  it("places the indicator at the trigger's end", () => {
    expect(recipe.base?.["itemIndicator"]).toMatchObject({ marginInlineStart: "auto" });
  });

  it("inks the indicator in fg under a hovered trigger", () => {
    expect(recipe.base?.["itemTrigger"]).toMatchObject({
      _hover: { "& .accordion__itemIndicator": { color: "fg" } },
    });
  });

  it("matches every Accordion tag", () => {
    expect(recipe.jsx).toStrictEqual([/^Accordion(\.\w+)?$/u]);
  });
});
