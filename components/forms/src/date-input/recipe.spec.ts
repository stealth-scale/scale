import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#date-input/date-input.specimen.tsx";
import { recipe } from "#date-input/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["DateInput.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to date-input", () => {
    expect(recipe.className).toBe("date-input");
  });

  it("declares size status and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "status", "variant"]);
  });

  it("defaults to an outline field at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("declares the sizes a field passes down", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("rings the segment group while a segment inside it has focus", () => {
    expect(recipe.base?.["segmentGroup"]).toMatchObject({
      _focusWithin: { outlineColor: "var(--focus-ring-color)" },
    });
  });

  it("keeps every editable segment at least 24px square", () => {
    expect(recipe.base?.["segment"]).toMatchObject({ minBlockSize: "6", minInlineSize: "6" });
  });

  it("keeps a focused placeholder in the contrast ink", () => {
    expect(recipe.base?.["segment"]).toHaveProperty(["&[data-placeholder-shown]:not(:focus)"]);
  });

  it("fills a focused segment with Highlight under forced colors", () => {
    expect(recipe.base?.["segment"]).toMatchObject({
      _focus: { _highContrast: { background: "Highlight", color: "HighlightText" } },
    });
  });

  it("keeps room for the clear trigger in the last group while it shows", () => {
    expect(Object.keys(recipe.variants?.["size"]?.["md"]?.["segmentGroup"] ?? {})).toContain(
      ".date-input__control:has(> .date-input__clearTrigger:not([hidden])) > &:last-of-type",
    );
  });
});
