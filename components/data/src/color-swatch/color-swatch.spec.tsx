import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeElement } from "@stealthscale/testing-theme";

import { ColorSwatch } from "#color-swatch/color-swatch.tsx";

describe("ColorSwatch", () => {
  it("sets the colour custom property to the value", () => {
    const { container } = render(<ColorSwatch value="#D72323" />);

    expect(
      recipeElement(container, "color-swatch").style.getPropertyValue("--color-swatch-value"),
    ).toBe("#D72323");
  });

  it("writes the value to data-value", () => {
    const { container } = render(<ColorSwatch value="#D72323" />);

    expect(recipeElement(container, "color-swatch").dataset["value"]).toBe("#D72323");
  });

  it("keeps a style the caller passes beside the colour", () => {
    const { container } = render(<ColorSwatch style={{ opacity: 0.5 }} value="#D72323" />);

    expect(recipeElement(container, "color-swatch").style.opacity).toBe("0.5");
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => <ColorSwatch value="#D72323" />),
    ).resolves.toStrictEqual([]);
  });
});
