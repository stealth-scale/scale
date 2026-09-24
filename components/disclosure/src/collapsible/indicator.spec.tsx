import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, disclosed } from "#collapsible/collapsible.fixtures.tsx";
import { Indicator } from "#collapsible/indicator.tsx";

describe("Indicator", () => {
  it("renders a span", () => {
    const { container } = render(disclosed(<Indicator>v</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").tagName).toBe("SPAN");
  });

  it("sets data-state open while open", () => {
    const { container } = render(composed({ defaultOpen: true }));

    expect(slotElement(container, "collapsible", "indicator").dataset["state"]).toBe("open");
  });

  it("renders the element as names", () => {
    const { container } = render(disclosed(<Indicator as="svg">v</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").tagName).toBe("svg");
  });

  it("sets aria-hidden", () => {
    const { container } = render(disclosed(<Indicator>▾</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("keeps a caller's aria-hidden false", () => {
    const { container } = render(disclosed(<Indicator aria-hidden={false}>3 more</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });
});
