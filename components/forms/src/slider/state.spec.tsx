import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SharedProvider, ThumbProvider, useShared, useThumbIndex } from "#slider/state.ts";

/**
 * Renders the shared state through the hook under test.
 *
 * @returns The state as text.
 */
function Sharing(): ReactElement {
  const { format, label, thumbId } = useShared();

  return <span data-testid="shared">{`${format(4)} ${label ?? "none"} ${thumbId(1)}`}</span>;
}

/**
 * Renders a thumb's position through the hook under test.
 *
 * @returns The position as text.
 */
function Indexing(): ReactElement {
  return <span data-testid="index">{String(useThumbIndex())}</span>;
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <SharedProvider
        value={{
          described: undefined,
          format: (value) => `${String(value)}%`,
          formatted: true,
          label: "label",
          readOnly: false,
          thumbId: (index) => `thumb-${String(index)}`,
        }}
      >
        <Sharing />
      </SharedProvider>,
    );

    expect(screen.getByTestId("shared").textContent).toBe("4% label thumb-1");
  });

  it("returns the position the thumb above passes", () => {
    render(
      <ThumbProvider value={1}>
        <Indexing />
      </ThumbProvider>,
    );

    expect(screen.getByTestId("index").textContent).toBe("1");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Sharing />)).toThrow(
      "A part of Slider was drawn outside the root that holds it together.",
    );
  });

  it("throws for a dragging indicator outside a thumb", () => {
    expect(() => render(<Indexing />)).toThrow(
      "A part of Slider.Thumb was drawn outside the root that holds it together.",
    );
  });
});
