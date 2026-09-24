import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, listed } from "#menu/menu.fixtures.tsx";
import { Positioner } from "#menu/positioner.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(listed(<Positioner />));

    expect(slotElement(container, "menu", "positioner").tagName).toBe("DIV");
  });

  it("takes the machine's absolute position", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "positioner").style.position).toBe("absolute");
  });

  it("contains the content", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(
      slotElement(container, "menu", "positioner").querySelector("[data-part=content]"),
    ).not.toBeNull();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(listed(<Positioner as="span" />));

    expect(slotElement(container, "menu", "positioner").tagName).toBe("SPAN");
  });
});
