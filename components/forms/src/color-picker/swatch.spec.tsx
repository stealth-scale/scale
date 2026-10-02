import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { opened, picker } from "#color-picker/color-picker.fixtures.tsx";
import { Swatch } from "#color-picker/swatch.tsx";

describe("Swatch", () => {
  it("paints its trigger's color through the swatch's custom property", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(
      slotElement(container, "color-picker", "swatch").style.getPropertyValue(
        "--color-swatch-value",
      ),
    ).toBe("rgba(37, 99, 235, 1)");
  });

  it("paints the color passed as value", async () => {
    const { container } = await drawn(picker({}, { panel: <Swatch value="#0D9488" /> }));

    await opened();

    expect(
      slotElement(container, "color-picker", "swatch").style.getPropertyValue(
        "--color-swatch-value",
      ),
    ).toBe("rgba(13, 148, 136, 1)");
  });

  it("leaves out the fill the machine writes inline", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "swatch").style.background).toBe("");
  });

  it("is hidden from assistive technology", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "swatch").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("fills the box it is in", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect([...slotElement(container, "color-picker", "swatch").classList]).toContain(
      variantClass("color-swatch", "size", "full"),
    );
  });
});
