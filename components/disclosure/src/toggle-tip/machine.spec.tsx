import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { useToggleTip } from "#toggle-tip/machine.ts";
import { Root } from "#toggle-tip/root.tsx";

/**
 * Renders the open state the toggle tip's context reports.
 *
 * @returns A `span` with `open` or `shut`.
 */
function Reader(): ReactElement {
  const api = useToggleTip();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("useToggleTip", () => {
  it("returns the api of the root above it", async () => {
    await drawn(
      <Root>
        <Reader />
      </Root>,
    );

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("throws with the toggle tip's name outside a root", () => {
    expect(() => render(<Reader />)).toThrow(
      "A part of ToggleTip was drawn outside the root that holds it together.",
    );
  });
});
