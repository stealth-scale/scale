import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#popover/arrow.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Arrow", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Arrow />));

    expect(slotElement(container, "popover", "arrow").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Arrow />));

    expect(slotElement(container, "popover", "arrow").className).toContain("popover__arrow");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Arrow as="span" />));

    expect(slotElement(container, "popover", "arrow").tagName).toBe("SPAN");
  });
});
