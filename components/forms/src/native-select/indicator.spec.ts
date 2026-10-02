import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { selected } from "#native-select/native-select.fixtures.tsx";

describe("Indicator", () => {
  it("renders a SPAN for the indicator slot", () => {
    const { container } = render(selected());

    expect(slotElement(container, "native-select", "indicator").tagName).toBe("SPAN");
  });

  it("hides itself from screen readers by default", () => {
    const { container } = render(selected());

    expect(slotElement(container, "native-select", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
