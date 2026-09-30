import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#qr-code/qr-code.fixtures.tsx";

describe("Pattern", () => {
  it("renders the first dark module inside the quiet zone", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "qr-code", "pattern").getAttribute("d")).toMatch(
      /^M40,40h10v10h-10z/u,
    );
  });

  it("sets fill to black", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "qr-code", "pattern").getAttribute("fill")).toBe("black");
  });

  it("renders a path", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "qr-code", "pattern").tagName.toLowerCase()).toBe("path");
  });
});
