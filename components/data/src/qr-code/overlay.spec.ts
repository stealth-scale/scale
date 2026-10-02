import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#qr-code/qr-code.fixtures.tsx";

describe("Overlay", () => {
  it("hides the mark from assistive technology", async () => {
    const { container } = await drawn(composed({}, { marked: true }));

    expect(slotElement(container, "qr-code", "overlay").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders its children", async () => {
    const { container } = await drawn(composed({}, { marked: true }));

    expect(slotElement(container, "qr-code", "overlay").firstElementChild?.tagName).toBe("svg");
  });
});
