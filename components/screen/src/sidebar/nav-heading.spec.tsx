import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { NavHeading } from "#sidebar/nav-heading.tsx";
import { blocked } from "#sidebar/sidebar.fixtures.tsx";

describe("NavHeading", () => {
  it("renders an h2 inside a block", () => {
    const { container } = render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(slotElement(container, "sidebar", "navHeading").tagName).toBe("H2");
  });

  it("exposes a level 2 heading with its text as the name", () => {
    render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(screen.getByRole("heading", { level: 2, name: "Components" })).toBeTruthy();
  });

  it("renders the id passed as id", () => {
    const { container } = render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(slotElement(container, "sidebar", "navHeading").id).toBe("one");
  });

  it("leaves the block's name to its label", () => {
    const { container } = render(blocked(<NavHeading id="one">Components</NavHeading>));

    expect(slotElement(container, "sidebar", "nav").getAttribute("aria-labelledby")).not.toBe(
      "one",
    );
  });

  it("renders the heading level passed as as", () => {
    render(
      blocked(
        <NavHeading as="h3" id="one">
          Components
        </NavHeading>,
      ),
    );

    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });

  it("throws outside a sidebar", () => {
    expect(() => render(<NavHeading id="one">Components</NavHeading>)).toThrow(/navHeading/u);
  });
});
