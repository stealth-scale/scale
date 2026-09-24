import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#popover/indicator.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Indicator", () => {
  it("renders a span", () => {
    const { container } = render(opened(<Indicator />));

    expect(slotElement(container, "popover", "indicator").tagName).toBe("SPAN");
  });

  it("applies its slot class", () => {
    const { container } = render(opened(<Indicator />));

    expect(slotElement(container, "popover", "indicator").className).toContain(
      "popover__indicator",
    );
  });

  it("renders the element as names", () => {
    const { container } = render(opened(<Indicator as="svg" />));

    expect(slotElement(container, "popover", "indicator").tagName).toBe("svg");
  });

  it("sets aria-hidden", () => {
    const { container } = render(opened(<Indicator>▾</Indicator>));

    expect(slotElement(container, "popover", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps a caller's aria-hidden false", () => {
    const { container } = render(opened(<Indicator aria-hidden={false}>3 more</Indicator>));

    expect(slotElement(container, "popover", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });
});
