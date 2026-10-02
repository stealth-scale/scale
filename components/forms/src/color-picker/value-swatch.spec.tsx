import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { picker } from "#color-picker/color-picker.fixtures.tsx";
import { Root } from "#color-picker/root.tsx";
import { ValueSwatch } from "#color-picker/value-swatch.tsx";

describe("ValueSwatch", () => {
  it("renders an image named by the color in hex", async () => {
    await drawn(picker());

    expect(screen.getByRole("img", { name: "#2563EB" }).tagName).toBe("SPAN");
  });

  it("is named by eight hex digits for a translucent color", async () => {
    await drawn(picker({ defaultValue: "rgba(37, 99, 235, 0.5)" }));

    expect(screen.getByRole("img", { name: "#2563EB80" })).toBeDefined();
  });

  it("paints the color through the swatch's custom property", async () => {
    await drawn(picker());

    expect(screen.getByRole("img").style.getPropertyValue("--color-swatch-value")).toBe(
      "rgba(37, 99, 235, 1)",
    );
  });

  it("fills the box it is in by default", async () => {
    const { container } = await drawn(picker());

    expect([...slotElement(container, "color-picker", "valueSwatch").classList]).toContain(
      variantClass("color-swatch", "size", "full"),
    );
  });

  it("takes the size passed as size", async () => {
    const { container } = await drawn(
      <Root defaultValue="#2563EB">
        <ValueSwatch size="lg" />
      </Root>,
    );

    expect([...slotElement(container, "color-picker", "valueSwatch").classList]).toContain(
      variantClass("color-swatch", "size", "lg"),
    );
  });
});
