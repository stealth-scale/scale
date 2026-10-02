import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picker } from "#color-picker/color-picker.fixtures.tsx";
import { SwatchIndicator } from "#color-picker/swatch-indicator.tsx";

describe("SwatchIndicator", () => {
  it("shows on the trigger whose color is the picker's", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(
      [...container.querySelectorAll(".color-picker__swatch-indicator")].map((indicator) =>
        indicator.hasAttribute("hidden"),
      ),
    ).toStrictEqual([false, true]);
  });

  it("is hidden from assistive technology", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(
      container.querySelector(".color-picker__swatch-indicator")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("marks the color passed as value", async () => {
    const { container } = await drawn(picker({}, { panel: <SwatchIndicator value="#2563EB" /> }));

    await opened();

    expect(container.querySelector(".color-picker__swatch-indicator")?.hasAttribute("hidden")).toBe(
      false,
    );
  });
});
