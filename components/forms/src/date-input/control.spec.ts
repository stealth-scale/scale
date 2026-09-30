import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { dated, focused, segment } from "#date-input/date-input.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the group", async () => {
    const { container } = await drawn(dated());

    expect(
      slotElement(container, "date-input", "control").contains(screen.getByRole("group")),
    ).toBe(true);
  });

  it("sets data-focus while a segment has focus", async () => {
    const { container } = await drawn(dated());

    await focused(segment("day, Appointment"));

    expect(slotElement(container, "date-input", "control").dataset["focus"]).toBe("");
  });
});
