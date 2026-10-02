import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ShownProvider, useShown } from "#listbox/shown.ts";

/**
 * Renders the settings it reads.
 *
 * @returns A `span` with `boxed` and the two marks.
 */
function Reader(): ReactElement {
  const { boxed, mark, mixedMark } = useShown();

  return (
    <span data-testid="shape">
      {String(boxed)}
      {mark}
      {mixedMark}
    </span>
  );
}

describe("useShown", () => {
  it("returns the settings the provider states", () => {
    render(
      <ShownProvider value={{ boxed: true, mark: "check", mixedMark: "dash" }}>
        <Reader />
      </ShownProvider>,
    );

    expect(screen.getByTestId("shape").textContent).toBe("truecheckdash");
  });

  it("throws outside a provider", () => {
    expect(() => render(<Reader />)).toThrow(/Listbox/u);
  });
});
