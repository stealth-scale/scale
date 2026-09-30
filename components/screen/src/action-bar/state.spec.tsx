import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Root } from "#action-bar/index.ts";
import { useActionBar } from "#action-bar/state.ts";

/**
 * Renders whether the bar the context reports is open.
 *
 * @returns A `span` with `open` or `shut`.
 */
function Reader(): ReactElement {
  const { open } = useActionBar();

  return <span data-testid="state">{open ? "open" : "shut"}</span>;
}

describe("useActionBar", () => {
  it("reports the root's open state to a part", async () => {
    await drawn(
      <Root open>
        <Reader />
      </Root>,
    );

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("throws outside a root", () => {
    expect(() => render(<Reader />)).toThrow(/ActionBar/u);
  });
});
