import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#timer/timer.fixtures.tsx";

describe("Separator", () => {
  it("renders the caller's mark", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "timer", "separator").textContent).toBe(":");
  });

  it("hides the mark from assistive technology", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "timer", "separator").getAttribute("aria-hidden")).toBe("true");
  });
});
