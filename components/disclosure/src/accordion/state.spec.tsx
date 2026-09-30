import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, rootedViolations } from "@stealthscale/testing-react";

import { itemed } from "#accordion/accordion.fixtures.tsx";
import { useItem } from "#accordion/state.ts";

/**
 * Renders the value and the open state an item provides.
 *
 * @returns The value and the state as text.
 */
function Reader(): ReactElement {
  const { collapsible, options } = useItem();

  return <span data-testid="item">{`${options.value} ${String(collapsible.open)}`}</span>;
}

describe("state", () => {
  it("provides the item's value and its collapsible api to a part inside it", async () => {
    await drawn(itemed(<Reader />));

    expect(screen.getByTestId("item").textContent).toBe("first false");
  });

  it("throws for a part rendered outside an item", () => {
    expect(
      rootedViolations(
        { Reader },
        "A part of Accordion.Item was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
