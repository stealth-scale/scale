import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#toggle-tip/arrow.tsx";
import { opened } from "#toggle-tip/toggle-tip.fixtures.tsx";

describe("Arrow", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Arrow />));

    expect(slotElement(container, "toggle-tip", "arrow").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Arrow />));

    expect(slotElement(container, "toggle-tip", "arrow").className).toContain("toggle-tip__arrow");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Arrow as="span" />));

    expect(slotElement(container, "toggle-tip", "arrow").tagName).toBe("SPAN");
  });
});
