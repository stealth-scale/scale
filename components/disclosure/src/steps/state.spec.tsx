import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, rootedViolations } from "@stealthscale/testing-react";

import { useItem } from "#steps/state.ts";
import { itemed } from "#steps/steps.fixtures.tsx";

/**
 * Renders the index an item provides.
 *
 * @returns The index as text.
 */
function Reader(): ReactElement {
  const { index } = useItem();

  return <span data-testid="index">{index}</span>;
}

describe("state", () => {
  it("provides the item's index to a part inside it", async () => {
    await drawn(itemed(<Reader />, {}, 2));

    expect(screen.getByTestId("index").textContent).toBe("2");
  });

  it("throws for a part rendered outside an item", () => {
    expect(
      rootedViolations(
        { Reader },
        "A part of Steps.Item was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
