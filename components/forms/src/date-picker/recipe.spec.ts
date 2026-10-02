import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#date-picker/date-picker.specimen.tsx";
import { CLEARED } from "#date-picker/metrics.ts";
import { recipe } from "#date-picker/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["DatePicker.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to date-picker", () => {
    expect(recipe.className).toBe("date-picker");
  });

  it("declares palette size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["palette", "size", "status", "variant"]);
  });

  it("defaults to an outline input at the middle size in the primary palette", () => {
    expect(defaultsOf(recipe)).toStrictEqual({
      palette: "primary",
      size: "md",
      variant: "outline",
    });
  });

  it("declares the sizes a field passes down", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("offers the four palettes that are not statuses", () => {
    expect(valuesOf(recipe, "palette")).toStrictEqual([
      "accent",
      "neutral",
      "primary",
      "secondary",
    ]);
  });

  it("drops the shadow of a panel rendered in place", () => {
    expect(recipe.base?.["content"]).toMatchObject({ "&[data-inline]": { boxShadow: "none" } });
  });

  it("caps a floating panel at the room the positioner reports", () => {
    expect(recipe.base?.["content"]).toMatchObject({ maxBlockSize: "var(--available-height)" });
  });

  it("sets no cap on a panel rendered in place", () => {
    expect(recipe.base?.["content"]).toMatchObject({ "&[data-inline]": { maxBlockSize: "none" } });
  });

  it("leaves the scrolling to the scroll area of the views", () => {
    expect(recipe.base?.["content"]).not.toHaveProperty("overflowY");
  });

  it("stops the viewport's scroll at the panel's ends", () => {
    expect(recipe.base?.["viewport"]).toStrictEqual({ overscrollBehavior: "contain" });
  });

  it("keeps a focused cell the panel's padding from the viewport's edge", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["viewport"]).toStrictEqual({
      scrollPadding: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("pads the column of views by the panel's padding with the gap one size smaller", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["body"]).toStrictEqual({
      gap: "calc({spacing.gap.sm} * var(--density, 1))",
      padding: "calc({spacing.gap.sm} * var(--density, 1))",
    });
  });

  it("lets the pointer through a disabled view trigger", () => {
    expect(recipe.base?.["viewTrigger"]).toMatchObject({ _disabled: { pointerEvents: "none" } });
  });

  it("keeps a disabled view trigger's text in CanvasText under forced colors", () => {
    expect(recipe.base?.["viewTrigger"]).toMatchObject({
      _disabled: { _highContrast: { color: "CanvasText", forcedColorAdjust: "none" } },
    });
  });

  it("hides the hidden inputs visually", () => {
    expect(recipe.base?.["hiddenInput"]).toStrictEqual({ srOnly: true });
  });

  it("keeps room for the clear trigger in the last input while it shows", () => {
    expect(Object.keys(recipe.variants?.["size"]?.["md"]?.["input"] ?? {})).toContain(CLEARED);
  });

  it.each(["sm", "md", "lg"] as const)(
    "sizes the clear trigger's glyph as the trigger's at size %s",
    (size) => {
      const slots = recipe.variants?.["size"]?.[size];

      expect(slots?.["clearTrigger"]?.["& svg"]).toStrictEqual(slots?.["trigger"]?.["& svg"]);
    },
  );
});
