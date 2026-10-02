import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picked } from "#select/select.fixtures.tsx";

describe("Control", () => {
  it("renders a div", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "control").tagName).toBe("DIV");
  });

  it("sets data-state to closed while the panel is closed", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "control").dataset["state"]).toBe("closed");
  });

  it("sets data-state to open while the panel is open", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(slotElement(container, "select", "control").dataset["state"]).toBe("open");
  });
});
