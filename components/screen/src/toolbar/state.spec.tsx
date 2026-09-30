import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToolbarProvider, useToolbar } from "#toolbar/state.ts";

/**
 * Renders the size that `useToolbar` returns.
 *
 * @returns The size as text.
 */
function Reader(): ReactElement {
  const toolbar = useToolbar();

  return <span data-testid="size">{toolbar.size}</span>;
}

describe("state", () => {
  it("returns the state the provider sets from useToolbar", () => {
    render(
      <ToolbarProvider value={{ narrow: false, size: "lg" }}>
        <Reader />
      </ToolbarProvider>,
    );

    expect(screen.getByTestId("size").textContent).toBe("lg");
  });

  it("throws from useToolbar outside a toolbar", () => {
    expect(() => render(<Reader />)).toThrow(/Toolbar/u);
  });
});
