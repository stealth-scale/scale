import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { useDrawer } from "#drawer/machine.ts";
import { Root } from "#drawer/root.tsx";

/**
 * Renders the open state the drawer's context reports.
 *
 * @returns A `span` with `open` or `shut`.
 */
function Reader(): ReactElement {
  const api = useDrawer();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("useDrawer", () => {
  it("returns the api of the root above it", async () => {
    await drawn(
      <Root>
        <Reader />
      </Root>,
    );

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("throws with the drawer's name outside a root", () => {
    expect(() => render(<Reader />)).toThrow(
      "A part of Drawer was drawn outside the root that holds it together.",
    );
  });
});
