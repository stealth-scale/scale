import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Nav } from "#page/nav.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Nav", () => {
  it("renders a nav", () => {
    const { container } = render(paged(<Nav aria-label="Invoice">Lines</Nav>));

    expect(slotElement(container, "page", "nav").tagName).toBe("NAV");
  });

  it("sets role navigation named by aria-label", () => {
    render(paged(<Nav aria-label="Invoice">Lines</Nav>));

    expect(screen.getByRole("navigation", { name: "Invoice" })).toBeTruthy();
  });

  it("sets data-sticky when sticky", () => {
    const { container } = render(
      paged(
        <Nav aria-label="Invoice" sticky>
          Lines
        </Nav>,
      ),
    );

    expect(slotElement(container, "page", "nav").dataset["sticky"]).toBe("");
  });

  it("renders nothing on a narrow page when when is wide", () => {
    render(
      narrowed(
        paged(
          <Nav aria-label="Invoice" when="wide">
            Lines
          </Nav>,
        ),
      ),
    );

    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
