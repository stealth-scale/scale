import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Positioner } from "#tooltip/positioner.tsx";
import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(hinted(<Positioner />));

    expect(slotElement(container, "tooltip", "positioner").tagName).toBe("DIV");
  });

  it("takes the machine's absolute position", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "tooltip", "positioner").style.position).toBe("absolute");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(hinted(<Positioner as="span" />));

    expect(slotElement(container, "tooltip", "positioner").tagName).toBe("SPAN");
  });
});
