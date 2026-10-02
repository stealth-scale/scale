import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { card } from "#checkbox-card/checkbox-card.fixtures.tsx";

describe("Control", () => {
  it("renders a span", async () => {
    const { container } = await drawn(card());

    expect(slotElement(container, "checkbox-card", "control").tagName).toBe("SPAN");
  });

  it("hides the box from assistive technology", async () => {
    const { container } = await drawn(card());

    expect(slotElement(container, "checkbox-card", "control").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sets data-state to checked on a checked card", async () => {
    const { container } = await drawn(card({ defaultChecked: true }));

    expect(slotElement(container, "checkbox-card", "control").dataset["state"]).toBe("checked");
  });
});
