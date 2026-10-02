import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { inside } from "#details/details.fixtures.tsx";
import { Indicator } from "#details/indicator.tsx";

describe("Indicator", () => {
  it("renders a span with the details' indicator class", () => {
    const { container } = render(inside(<Indicator>&gt;</Indicator>));

    expect(slotElement(container, "details", "indicator").tagName).toBe("SPAN");
  });

  it("hides the mark from assistive technology by default", () => {
    const { container } = render(inside(<Indicator>&gt;</Indicator>));

    expect(slotElement(container, "details", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps the mark in the accessibility tree when aria-hidden is false", () => {
    const { container } = render(inside(<Indicator aria-hidden={false}>&gt;</Indicator>));

    expect(slotElement(container, "details", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });
});
