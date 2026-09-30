import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SharedProvider, useShared } from "#angle-slider/state.ts";

/**
 * Renders the shared state through the hook under test.
 *
 * @returns The state as text.
 */
function Sharing(): ReactElement {
  const { dir, format, label, step, thumbId } = useShared();

  return (
    <span data-testid="shared">{`${format(45)} ${label ?? "none"} ${thumbId} ${String(step)} ${dir}`}</span>
  );
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <SharedProvider
        value={{
          described: undefined,
          dir: "rtl",
          disabled: false,
          format: (value) => `${String(value)}°`,
          interactive: true,
          label: "label",
          send: () => {},
          step: 5,
          thumbId: "thumb",
        }}
      >
        <Sharing />
      </SharedProvider>,
    );

    expect(screen.getByTestId("shared").textContent).toBe("45° label thumb 5 rtl");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Sharing />)).toThrow(
      "A part of AngleSlider was drawn outside the root that holds it together.",
    );
  });
});
