import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#signature-pad/signature-pad.fixtures.tsx";

describe("Guide", () => {
  it("renders a div hidden from assistive technology", async () => {
    const { container } = await drawn(composed());
    const guide = slotElement(container, "signature-pad", "guide");

    expect([guide.tagName, guide.getAttribute("aria-hidden")]).toStrictEqual(["DIV", "true"]);
  });

  it("renders inside the control", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "signature-pad", "guide").parentElement).toBe(
      slotElement(container, "signature-pad", "control"),
    );
  });
});
