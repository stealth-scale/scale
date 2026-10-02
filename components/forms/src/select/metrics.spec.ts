import { describe, expect, it } from "vitest";

import { glyph, indicatorEnd, inset } from "#dropdown.ts";
import { CLASS, cleared, CLEARED, clearEnd, indicated, PLACEHOLDER } from "#select/metrics.ts";

describe("metrics", () => {
  it("sets CLASS to select", () => {
    expect(CLASS).toBe("select");
  });

  it("selects the trigger of a control whose clear trigger shows", () => {
    expect(CLEARED).toBe(".select__control:has(> .select__clearTrigger:not([hidden])) > &");
  });

  it("selects the value text of a trigger with nothing selected", () => {
    expect(PLACEHOLDER).toBe("[data-placeholder-shown] > &");
  });

  it("adds the inset the glyph and the smallest gap for the indicator's room", () => {
    expect(indicated("sm")).toBe(
      `calc(${inset("sm")} + ${glyph("sm")} + calc({spacing.gap.xs} * var(--density, 1)))`,
    );
  });

  it("adds the clear trigger's square to the indicator's room", () => {
    expect(cleared("md")).toBe(
      `calc(${indicated("md")} + max({sizes.6}, calc({sizes.tag.md} * var(--density, 1))) + calc({spacing.gap.xs} * var(--density, 1)))`,
    );
  });

  it("places the clear trigger past the indicator's glyph and the smallest gap", () => {
    expect(clearEnd("md")).toBe(
      `calc(${indicatorEnd("md")} + ${glyph("md")} + calc({spacing.gap.xs} * var(--density, 1)))`,
    );
  });
});
