import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SharedProvider, useShared } from "#editable/state.ts";

/**
 * Renders the shared state through the hook under test.
 *
 * @returns The state as text.
 */
function Reading(): ReactElement {
  const { label, preview, readOnly } = useShared();

  return <span data-testid="shared">{`${label ?? "none"} ${preview} ${String(readOnly)}`}</span>;
}

describe("state", () => {
  it("returns the state the provider above passes", () => {
    render(
      <SharedProvider value={{ label: "label", preview: "preview", readOnly: true }}>
        <Reading />
      </SharedProvider>,
    );

    expect(screen.getByTestId("shared").textContent).toBe("label preview true");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Reading />)).toThrow(
      "A part of Editable was drawn outside the root that holds it together.",
    );
  });
});
