import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import { recipe } from "#toc/recipe.ts";
import page from "#toc/toc.specimen.tsx";

/**
 * Room a focus ring takes outside an element, as the recipe writes it.
 */
const RING = "calc(var(--focus-ring-offset, 0px) + var(--focus-ring-width, 0px))";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(recipeViolations(recipe, { names: ["Toc"] })).toStrictEqual([]);
  });

  it("sets className to toc", () => {
    expect(recipe.className).toBe("toc");
  });

  it("declares eight slots", () => {
    expect([...recipe.slots].toSorted()).toStrictEqual([
      "content",
      "indicator",
      "item",
      "link",
      "list",
      "root",
      "scroller",
      "title",
    ]);
  });

  it("sticks the aside placement under the pinned bars at most as tall as the viewport", () => {
    expect(recipe.variants?.["placement"]?.["aside"]?.["root"]).toStrictEqual({
      alignSelf: "start",
      insetBlockStart:
        "calc(var(--app-shell-sticky-top, 0px) + calc({spacing.gap.lg} * var(--density, 1)))",
      maxBlockSize:
        "calc(100dvh - var(--app-shell-sticky-top, 0px) - calc({spacing.gap.lg} * var(--density, 1)) * 2)",
      position: "sticky",
    });
  });

  it("pulls the aside placement's scroll area out at its start edges by its content's padding", () => {
    expect(recipe.base?.["scroller"]).toStrictEqual({
      marginBlockStart: `calc(${RING} * -1)`,
      marginInlineStart: `calc(${RING} * -1)`,
    });
  });

  it("pads the aside placement's column by the room a focus ring takes", () => {
    expect(recipe.base?.["content"]).toStrictEqual({
      display: "flex",
      flexDirection: "column",
      padding: RING,
    });
  });

  it("declares the palette placement and size axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "placement", "size"]);
  });

  it("defaults to the inline placement at the md size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ placement: "inline", size: "md" });
  });

  it("declares every semantic palette on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("sets colorPalette on the root for each palette", () => {
    expect(recipe.variants?.["palette"]?.["error"]).toStrictEqual({
      root: { colorPalette: "error" },
    });
  });

  it("reads the primary palette on the root when palette is absent", () => {
    expect(recipe.base?.["root"]).toMatchObject({ colorPalette: "primary" });
  });

  it("declares sm md and lg on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("caps the 11rem minimum width of the root at its container", () => {
    expect(recipe.base?.["root"]).toMatchObject({ minInlineSize: "min({sizes.44}, 100%)" });
  });

  it("paints the indicator in CanvasText under forced colors", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
    });
  });

  it("gives the title and the links the same inline start padding at md", () => {
    expect(recipe.variants?.["size"]?.["md"]).toStrictEqual({
      content: { gap: "calc({spacing.gap.sm} * var(--density, 1))" },
      link: {
        paddingBlock: "calc({spacing.gap.xs} * var(--density, 1))",
        paddingInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
        paddingInlineStart: "calc({spacing.inset.md} * var(--density, 1))",
        textStyle: "body.sm",
      },
      root: { gap: "calc({spacing.gap.sm} * var(--density, 1))" },
      title: {
        paddingInlineEnd: "calc({spacing.inset.sm} * var(--density, 1))",
        paddingInlineStart: "calc({spacing.inset.md} * var(--density, 1))",
        textStyle: "label.xs",
      },
    });
  });

  it("positions the indicator from --top and --height", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      blockSize: "var(--height)",
      insetBlockStart: "var(--top)",
      position: "absolute",
    });
  });

  it("indents a row by one gap per level below depth 2", () => {
    expect(recipe.base?.["item"]).toStrictEqual({
      paddingInlineStart: "calc((var(--depth) - 2) * {spacing.gap.md})",
    });
  });

  it("reads fg on an active link and fg.muted on the others", () => {
    expect(recipe.base?.["link"]).toMatchObject({
      "&[data-active]": { color: "fg", fontWeight: "medium" },
      color: "fg.muted",
    });
  });

  it("removes the indicator transition under reduced motion", () => {
    expect(recipe.base?.["indicator"]).toMatchObject({
      _motionReduce: { transitionDuration: "0s" },
    });
  });

  it("matches the Toc tag and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Toc(\.\w+)?$/u]);
  });
});
