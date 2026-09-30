import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ItemProvider, SharedProvider, useItem, useShared } from "#tags-input/state.ts";

/**
 * Renders the shared state through the hook under test.
 *
 * @returns The state as text.
 */
function Sharing(): ReactElement {
  const { disabled, readOnly, size } = useShared();

  return <span data-testid="shared">{`${String(disabled)} ${String(readOnly)} ${size}`}</span>;
}

/**
 * Renders an item's tag through the hook under test.
 *
 * @returns The tag as text.
 */
function Tagging(): ReactElement {
  const { index, value } = useItem();

  return <span data-testid="item">{`${String(index)} ${value}`}</span>;
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <SharedProvider value={{ disabled: false, readOnly: true, size: "lg" }}>
        <Sharing />
      </SharedProvider>,
    );

    expect(screen.getByTestId("shared").textContent).toBe("false true lg");
  });

  it("returns the tag the item above passes", () => {
    render(
      <ItemProvider value={{ index: 1, value: "Halden & Co" }}>
        <Tagging />
      </ItemProvider>,
    );

    expect(screen.getByTestId("item").textContent).toBe("1 Halden & Co");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Sharing />)).toThrow(
      "A part of TagsInput was drawn outside the root that holds it together.",
    );
  });

  it("throws for an item part outside an item", () => {
    expect(() => render(<Tagging />)).toThrow(
      "A part of TagsInput.Item was drawn outside the root that holds it together.",
    );
  });
});
