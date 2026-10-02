import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#timer/timer.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the action triggers", async () => {
    const { container } = await drawn(composed());
    const control = slotElement(container, "timer", "control");

    expect([control.tagName, control.querySelectorAll("button").length]).toStrictEqual(["DIV", 5]);
  });
});
