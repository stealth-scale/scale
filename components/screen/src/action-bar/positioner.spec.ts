import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { barred } from "#action-bar/action-bar.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div around the bar", async () => {
    const { container } = await drawn(barred());

    expect(slotElement(container, "action-bar", "positioner").firstElementChild).toBe(
      slotElement(container, "action-bar", "content"),
    );
  });

  it("renders nothing before the bar first opens", async () => {
    const { container } = await drawn(barred({ open: false }));

    expect(container.querySelector(".action-bar__positioner")).toBeNull();
  });
});
