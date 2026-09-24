import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#popover/arrow.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Arrow", () => {
  it("renders a div", () => {
    const { container } = render(opened(<Arrow />));

    expect(slotElement(container, "popover", "arrow").tagName).toBe("DIV");
  });

  it("applies its slot class", () => {
    const { container } = render(opened(<Arrow />));

    expect(slotElement(container, "popover", "arrow").className).toContain("popover__arrow");
  });

  it("renders the element as names", () => {
    const { container } = render(opened(<Arrow as="span" />));

    expect(slotElement(container, "popover", "arrow").tagName).toBe("SPAN");
  });
});
