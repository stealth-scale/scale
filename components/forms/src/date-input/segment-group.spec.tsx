import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { dated, stay } from "#date-input/date-input.fixtures.tsx";
import { Segments } from "#date-input/segments.tsx";

describe("SegmentGroup", () => {
  it("renders a div in the group role", async () => {
    const { container } = await drawn(dated());

    expect(slotElement(container, "date-input", "segmentGroup").getAttribute("role")).toBe("group");
  });

  it("is named by the label", async () => {
    await drawn(dated());

    expect(screen.getByRole("group", { name: "Appointment" })).toBeDefined();
  });

  it("is named by the label followed by its own aria-label", async () => {
    await drawn(stay());

    expect(screen.getByRole("group", { name: "Stay Check-out" })).toBeDefined();
  });

  it("is named by its own aria-label without a label", async () => {
    await drawn(dated({}, { groups: <Segments aria-label="Birth date" />, label: null }));

    expect(screen.getByRole("group", { name: "Birth date" })).toBeDefined();
  });

  it("drops the machine's reference to a label that is not rendered", async () => {
    const { container } = await drawn(
      dated({}, { groups: <Segments aria-label="Birth date" />, label: null }),
    );

    expect(
      slotElement(container, "date-input", "segmentGroup").hasAttribute("aria-labelledby"),
    ).toBe(false);
  });
});
