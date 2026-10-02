import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#nav-list/indicator.tsx";
import { branched } from "#nav-list/nav-list.fixtures.tsx";

describe("Indicator", () => {
  it("renders a SPAN element inside a branch", () => {
    const { container } = render(branched(<Indicator>v</Indicator>));

    expect(slotElement(container, "nav-list", "indicator").tagName).toBe("SPAN");
  });

  it("sets aria-hidden to true", () => {
    const { container } = render(branched(<Indicator>v</Indicator>));

    expect(slotElement(container, "nav-list", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sets data-state to closed while the branch is closed", () => {
    const { container } = render(branched(<Indicator>v</Indicator>));

    expect(slotElement(container, "nav-list", "indicator").dataset["state"]).toBe("closed");
  });

  it("sets data-state to open while the branch is open", () => {
    const { container } = render(branched(<Indicator>v</Indicator>, { defaultOpen: true }));

    expect(slotElement(container, "nav-list", "indicator").dataset["state"]).toBe("open");
  });
});
