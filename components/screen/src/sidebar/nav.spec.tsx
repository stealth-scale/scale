import { renderToString } from "react-dom/server";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { NavLabel } from "#sidebar/nav-label.tsx";
import { Nav } from "#sidebar/nav.tsx";
import { aside, filtered, unlisted } from "#sidebar/sidebar.fixtures.tsx";

/**
 * Types a query into the sidebar's search field.
 */
function typed(query: string): void {
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: query } });
}

describe("Nav", () => {
  it("renders a nav inside the root", () => {
    const { container } = render(aside(<Nav />));

    expect(slotElement(container, "sidebar", "nav").tagName).toBe("NAV");
  });

  it("takes its name from its label", () => {
    render(
      aside(
        <Nav>
          <NavLabel>Workspace</NavLabel>
        </Nav>,
      ),
    );

    expect(screen.getByRole("navigation", { name: "Workspace" })).toBeTruthy();
  });

  it("has no name without a label", () => {
    render(aside(<Nav />));

    expect(screen.queryByRole("navigation", { name: /./u })).toBeNull();
  });

  it("takes its name from aria-label without a label", () => {
    render(aside(<Nav aria-label="Account" />));

    expect(screen.getByRole("navigation", { name: "Account" })).toBeTruthy();
  });

  it("takes its name from aria-label over its label", () => {
    render(
      aside(
        <Nav aria-label="Account">
          <NavLabel>Workspace</NavLabel>
        </Nav>,
      ),
    );

    expect(screen.getByRole("navigation", { name: "Account" })).toBeTruthy();
  });

  it("omits aria-labelledby when aria-label is passed", () => {
    const { container } = render(aside(<Nav aria-label="Account" />));

    expect(slotElement(container, "sidebar", "nav").getAttribute("aria-labelledby")).toBeNull();
  });

  it("gives two blocks distinct names", () => {
    render(
      aside(
        <>
          <Nav>
            <NavLabel>Workspace</NavLabel>
          </Nav>
          <Nav>
            <NavLabel>Account</NavLabel>
          </Nav>
        </>,
      ),
    );

    expect(screen.getByRole("navigation", { name: "Workspace" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Account" })).toBeTruthy();
  });

  it("sets data-unmatched while a query matches none of its rows", () => {
    render(filtered());

    typed("zebra");

    expect(
      screen.getByRole("navigation", { hidden: true, name: "Pages" }).dataset["unmatched"],
    ).toBe("");
  });

  it("sets no data-unmatched while a query matches one of its rows", () => {
    render(filtered());

    typed("cust");

    expect(screen.getByRole("navigation", { name: "Pages" }).dataset["unmatched"]).toBeUndefined();
  });

  it("sets no data-unmatched on a block without rows while a query is active", () => {
    render(unlisted());

    typed("zebra");

    expect(
      screen.getByRole("navigation", { name: "Account" }).dataset["unmatched"],
    ).toBeUndefined();
  });

  it("sets no data-unmatched without a query", () => {
    render(filtered());

    expect(screen.getByRole("navigation", { name: "Pages" }).dataset["unmatched"]).toBeUndefined();
  });

  it("renders no data-unmatched on the server", () => {
    expect(renderToString(filtered())).not.toContain("data-unmatched");
  });
});
