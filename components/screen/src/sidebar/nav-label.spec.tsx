import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { NavLabel } from "#sidebar/nav-label.tsx";
import { blocked } from "#sidebar/sidebar.fixtures.tsx";

describe("NavLabel", () => {
  it("renders an h2 inside a block", () => {
    const { container } = render(blocked(<NavLabel>Workspace</NavLabel>));

    expect(slotElement(container, "sidebar", "navLabel").tagName).toBe("H2");
  });

  it("exposes a level 2 heading with its text as the name", () => {
    render(blocked(<NavLabel>Workspace</NavLabel>));

    expect(screen.getByRole("heading", { level: 2, name: "Workspace" })).toBeTruthy();
  });

  it("renders the id the block's aria-labelledby points at", () => {
    const { container } = render(blocked(<NavLabel>Workspace</NavLabel>));

    expect(slotElement(container, "sidebar", "navLabel").id).toBe(
      slotElement(container, "sidebar", "nav").getAttribute("aria-labelledby"),
    );
  });

  it("renders the heading level passed as as", () => {
    render(blocked(<NavLabel as="h3">Workspace</NavLabel>));

    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });

  it("throws outside a block", () => {
    expect(() => render(<NavLabel>Workspace</NavLabel>)).toThrow(/Sidebar\.Nav/u);
  });
});
