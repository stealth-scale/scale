import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, rootedViolations } from "@stealthscale/testing-react";

import { Root } from "#swap/index.ts";
import { useSwapState } from "#swap/state.ts";

/**
 * Renders the state the root provides, as text.
 *
 * @returns The state, one field per word.
 */
function Reader(): ReactElement {
  const { lazyMount, swap, unmountOnExit } = useSwapState();

  return <span data-testid="state">{[swap, lazyMount, unmountOnExit].join(" ")}</span>;
}

describe("state", () => {
  it("provides the root's swap and render settings to a part inside it", async () => {
    await drawn(
      <Root lazyMount swap>
        <Reader />
      </Root>,
    );

    expect(screen.getByTestId("state").textContent).toBe("true true false");
  });

  it("throws for a part rendered outside a root", () => {
    expect(
      rootedViolations(
        { Reader },
        "A part of Swap was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
