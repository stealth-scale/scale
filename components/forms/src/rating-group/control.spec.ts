import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#rating-group/rating-group.fixtures.tsx";

describe("Control", () => {
  it("renders a div without a role around the items", async () => {
    const { container } = await drawn(composed());
    const control = slotElement(container, "rating-group", "control");

    expect([
      control.tagName,
      control.getAttribute("role"),
      control.querySelectorAll("[role=radio]").length,
    ]).toStrictEqual(["DIV", null, 5]);
  });
});
