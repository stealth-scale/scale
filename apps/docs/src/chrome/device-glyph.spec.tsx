import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DeviceGlyph } from "#chrome/device-glyph.tsx";

describe("DeviceGlyph", () => {
  it("draws a picture of the device", () => {
    const { container } = render(<DeviceGlyph device="tablet" />);

    expect(container.querySelector("svg")?.dataset["device"]).toBe("tablet");
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<DeviceGlyph device="phone" />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
