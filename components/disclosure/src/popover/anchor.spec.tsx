import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Anchor } from "#popover/anchor.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Anchor", () => {
  it("renders a div", () => {
    const { container } = render(opened(<Anchor />));

    expect(slotElement(container, "popover", "anchor").tagName).toBe("DIV");
  });

  it("applies its slot class", () => {
    const { container } = render(opened(<Anchor />));

    expect(slotElement(container, "popover", "anchor").className).toContain("popover__anchor");
  });

  it("renders the element as names", () => {
    const { container } = render(opened(<Anchor as="section" />));

    expect(slotElement(container, "popover", "anchor").tagName).toBe("SECTION");
  });
});
