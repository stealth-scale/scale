import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { input, opened, picked } from "#combobox/combobox.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the input", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "combobox", "control").contains(input())).toBe(true);
  });

  it("sets data-state to open while the panel is open", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(slotElement(container, "combobox", "control").dataset["state"]).toBe("open");
  });
});
