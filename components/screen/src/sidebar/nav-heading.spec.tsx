import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { NavHeading } from "#sidebar/nav-heading.tsx";
import { blocked } from "#sidebar/sidebar.fixtures.tsx";

describe("NavHeading", () => {
  it("draws a second-level heading inside the block it needs above it", () => {
    const { container } = render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(slotElement(container, "sidebar", "navHeading").tagName).toBe("H2");
  });

  it("is a heading a screen reader can jump to", () => {
    render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(screen.getByRole("heading", { level: 2, name: "Components" })).toBeTruthy();
  });

  it("carries the identifier the caller names its list by", () => {
    const { container } = render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(slotElement(container, "sidebar", "navHeading").id).toBe("one");
  });

  it("leaves the block's own label to name the landmark", () => {
    const { container } = render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(slotElement(container, "sidebar", "nav").getAttribute("aria-labelledby")).not.toBe(
      "one",
    );
  });

  it("draws the level a sidebar under a named region needs", () => {
    render(
      blocked(
        <NavHeading as="h3" id="one">
          Components
        </NavHeading>,
      ),
    );

    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });

  it("throws where no sidebar stands above it", () => {
    expect(() => render(<NavHeading id="one">Components</NavHeading>)).toThrow(/navHeading/u);
  });
});
