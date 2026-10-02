import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";
import { PALETTES } from "@stealthscale/theme/authoring";

import { CLASS, recipe } from "#splitter/recipe.ts";
import page from "#splitter/splitter.specimen.tsx";

/**
 * Selector of a line or a pill while its trigger is under the pointer, has focus or drags.
 */
const ACTIVE = `.${CLASS}__resizeTrigger:is(:hover, [data-focus], [data-focus-visible], [data-dragging]):not([data-disabled]) > &`;

/**
 * Selector of a part of a splitter whose panels sit in a row.
 */
const ACROSS = "&[data-orientation=horizontal]";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Splitter.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to splitter", () => {
    expect(recipe.className).toBe("splitter");
  });

  it("declares five slots", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "panel",
      "resizeTrigger",
      "resizeTriggerSeparator",
      "resizeTriggerIndicator",
    ]);
  });

  it("declares the palette axis alone", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette"]);
  });

  it("declares every semantic palette on the palette axis", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([...PALETTES].toSorted());
  });

  it("reads the primary palette on the root when palette is absent", () => {
    expect(recipe.base?.["root"]).toMatchObject({ colorPalette: "primary" });
  });

  it("lays the root out as a row or a column from the machine's orientation", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&[data-orientation=horizontal]": { flexDirection: "row" },
      "&[data-orientation=vertical]": { flexDirection: "column" },
      display: "flex",
    });
  });

  it("grows the root in a flex container and fills any other", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      blockSize: "full",
      flex: "1",
      inlineSize: "full",
    });
  });

  it("lays a panel out as a column its content can shrink in", () => {
    expect(recipe.base?.["panel"]).toStrictEqual({
      display: "flex",
      flexDirection: "column",
      minBlockSize: "0",
      minInlineSize: "0",
    });
  });

  it("pulls the trigger's strip over both panels by half its width", () => {
    expect(recipe.base?.["resizeTrigger"]?.[ACROSS]).toStrictEqual({
      inlineSize: "{sizes.2}",
      marginInline: "calc({sizes.2} * -0.5)",
    });
  });

  it("stacks the trigger at docked above the panels' positioned content", () => {
    expect(recipe.base?.["resizeTrigger"]).toMatchObject({
      position: "relative",
      zIndex: "docked",
    });
  });

  it("widens the trigger's hit area to sizes.6 under a coarse pointer", () => {
    expect(recipe.base?.["resizeTrigger"]?.["_touch"]).toMatchObject({
      [ACROSS]: {
        _before: { insetBlock: "0", insetInline: "calc(({sizes.6} - {sizes.2}) * -0.5)" },
      },
    });
  });

  it("drops the trigger's own focus ring while it renders the pill", () => {
    expect(
      recipe.base?.["resizeTrigger"]?.["&:has(> .splitter__resizeTriggerIndicator)"],
    ).toStrictEqual({ _focusVisible: { outlineStyle: "none" } });
  });

  it("sizes the pill sizes.6 along the line", () => {
    expect(recipe.base?.["resizeTriggerIndicator"]?.[ACROSS]).toStrictEqual({
      blockSize: "{sizes.6}",
      inlineSize: "{sizes.2}",
    });
  });

  it("fills an active pill with the palette's solid", () => {
    expect(recipe.base?.["resizeTriggerIndicator"]?.[ACTIVE]).toMatchObject({
      background: "colorPalette.solid",
    });
  });

  it("paints an active line in the palette's solid", () => {
    expect(recipe.base?.["resizeTriggerSeparator"]?.[ACTIVE]).toMatchObject({
      background: "colorPalette.solid",
    });
  });

  it("rings the pill while its trigger has keyboard focus", () => {
    expect(
      recipe.base?.["resizeTriggerIndicator"]?.[
        ".splitter__resizeTrigger:is(:focus-visible, [data-focus-visible]) > &"
      ],
    ).toMatchObject({ outlineColor: "colorPalette.focusRing", outlineStyle: "solid" });
  });

  it("hides the pill of a disabled trigger", () => {
    expect(recipe.base?.["resizeTriggerIndicator"]).toMatchObject({
      "&[data-disabled]": { visibility: "hidden" },
    });
  });

  it("paints the line in CanvasText under forced colours", () => {
    expect(recipe.base?.["resizeTriggerSeparator"]).toMatchObject({
      _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
    });
  });

  it("fills an active pill with Highlight under forced colours", () => {
    expect(recipe.base?.["resizeTriggerIndicator"]?.[ACTIVE]).toMatchObject({
      _highContrast: { background: "Highlight", borderColor: "Highlight" },
    });
  });

  it("rings the pill in CanvasText under forced colours", () => {
    expect(
      recipe.base?.["resizeTriggerIndicator"]?.[
        ".splitter__resizeTrigger:is(:focus-visible, [data-focus-visible]) > &"
      ],
    ).toMatchObject({ _highContrast: { outlineColor: "CanvasText" } });
  });

  it("matches the Splitter tag and its parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Splitter(\.\w+)?$/u]);
  });
});
