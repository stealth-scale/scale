import { describe, expect, it } from "vitest";

import { controlSide, fieldButton, swatchSide, thumb } from "#color-picker/metrics.ts";

describe("metrics", () => {
  it("sizes a control to the control scale", () => {
    expect(controlSide("md")).toBe("calc({sizes.control.md} * var(--density, 1))");
  });

  it("keeps a swatch trigger at least 24px wide", () => {
    expect(swatchSide("md")).toBe("max({sizes.6}, calc({sizes.7} * var(--density, 1)))");
  });

  it("edges a thumb with two pixels of the panel surface", () => {
    expect(thumb()).toMatchObject({
      borderColor: "bg.panel",
      borderRadius: "full",
      borderWidth: "md",
    });
  });

  it("clips a thumb's fill to its padding box", () => {
    expect(thumb()).toMatchObject({
      backgroundClip: "padding-box",
      backgroundColor: "var(--color-picker-thumb)",
    });
  });

  it("keeps a thumb absolutely placed under a coarse pointer", () => {
    expect(thumb()).toMatchObject({ _touch: { position: "absolute" } });
  });

  it("gives a field button a control's cursor", () => {
    expect(fieldButton()).toMatchObject({ cursor: "button", userSelect: "none" });
  });
});
