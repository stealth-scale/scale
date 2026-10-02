import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SharedProvider, useShared } from "#rating-group/state.ts";

/**
 * Renders the words for one value through the hook under test.
 *
 * @returns The words as text.
 */
function Naming(): ReactElement {
  return <span data-testid="words">{useShared().itemLabel(4)}</span>;
}

describe("state", () => {
  it("returns the item words the root above passes", () => {
    render(
      <SharedProvider
        value={{ itemLabel: (value) => `${String(value)} hearts`, release: () => {} }}
      >
        <Naming />
      </SharedProvider>,
    );

    expect(screen.getByTestId("words").textContent).toBe("4 hearts");
  });

  it("throws for an item outside a root", () => {
    expect(() => render(<Naming />)).toThrow(
      "A part of RatingGroup was drawn outside the root that holds it together.",
    );
  });
});
