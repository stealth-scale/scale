import { describe, expect, it } from "vitest";

import { CLASS, cleared, CLEARED, clearEnd, indicated, triggerEnd } from "#combobox/metrics.ts";
import { glyph, indicatorEnd } from "#dropdown.ts";

/**
 * Side of the input group's square at `md`.
 */
const SIDE = "max({sizes.6}, calc({sizes.tag.md} * var(--density, 1)))";

/**
 * Smallest gap of the scale.
 */
const GAP = "calc({spacing.gap.xs} * var(--density, 1))";

describe("metrics", () => {
  it("sets CLASS to combobox", () => {
    expect(CLASS).toBe("combobox");
  });

  it("selects the input of a control whose clear trigger shows", () => {
    expect(CLEARED).toBe(".combobox__control:has(> .combobox__clearTrigger:not([hidden])) > &");
  });

  it("centres the trigger's square on the indicator's glyph", () => {
    expect(triggerEnd("md")).toBe(`calc(${indicatorEnd("md")} - (${SIDE} - ${glyph("md")}) / 2)`);
  });

  it("places the clear trigger past the trigger's square and the smallest gap", () => {
    expect(clearEnd("md")).toBe(`calc(${triggerEnd("md")} + ${SIDE} + ${GAP})`);
  });

  it("keeps room at the input's end up to the clear trigger's place", () => {
    expect(indicated("md")).toBe(`calc(${clearEnd("md")} - {borderWidths.control})`);
  });

  it("adds the clear trigger's square and the smallest gap while it shows", () => {
    expect(cleared("md")).toBe(`calc(${indicated("md")} + ${SIDE} + ${GAP})`);
  });
});
