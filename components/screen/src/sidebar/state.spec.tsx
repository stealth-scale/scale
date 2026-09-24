import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavProvider, useNav } from "#sidebar/state.ts";

/**
 * Renders the label identifier `useNav` returns.
 *
 * @returns A span with the identifier.
 */
function Reader(): ReactElement {
  const nav = useNav();

  return <span data-testid="read">{nav.labelId}</span>;
}

describe("useNav", () => {
  it("returns the state of the provider above it", () => {
    render(
      <NavProvider value={{ labelId: "workspace" }}>
        <Reader />
      </NavProvider>,
    );

    expect(screen.getByTestId("read").textContent).toBe("workspace");
  });

  it("throws outside a Sidebar.Nav", () => {
    expect(() => render(<Reader />)).toThrow(/Sidebar\.Nav/u);
  });
});
