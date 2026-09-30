import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picked } from "#select/select.fixtures.tsx";

describe("Indicator", () => {
  it("renders a span hidden from assistive technology", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("sets data-state to open while the panel is open", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(slotElement(container, "select", "indicator").dataset["state"]).toBe("open");
  });
});
