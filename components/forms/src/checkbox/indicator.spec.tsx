import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { boxed, composed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { Indicator } from "#checkbox/indicator.tsx";

describe("Indicator", () => {
  it("renders a span inside the root", () => {
    const { container } = render(boxed(<Indicator>t</Indicator>));

    expect(slotElement(container, "checkbox", "indicator").tagName).toBe("SPAN");
  });

  it("hides the mark while the box is unchecked", () => {
    const { container } = render(boxed(<Indicator>t</Indicator>));

    expect(slotElement(container, "checkbox", "indicator").hidden).toBe(true);
  });

  it("shows the mark after a press checks the box", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("checkbox"));

    expect(slotElement(container, "checkbox", "indicator").hidden).toBe(false);
  });

  it("shows only the checked mark on a checked box", () => {
    render(composed({ defaultChecked: true }));

    expect(screen.getByText("t").hidden).toBe(false);
    expect(screen.getByText("-").hidden).toBe(true);
  });

  it("shows only the partly-on mark on a partly-on box", () => {
    render(composed({ checked: "indeterminate" }));

    expect(screen.getByText("-").hidden).toBe(false);
    expect(screen.getByText("t").hidden).toBe(true);
  });

  it("hides the checked mark while the box is partly on", () => {
    const { container } = render(boxed(<Indicator>t</Indicator>, { checked: "indeterminate" }));

    expect(slotElement(container, "checkbox", "indicator").hidden).toBe(true);
  });
});
