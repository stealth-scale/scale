import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ShownProvider, useShown } from "#listbox/shown.ts";

/**
 * Reads the row shape and draws what the list handed it.
 *
 * @returns Whether a box is drawn, and the two marks the list was given.
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
  it("hands a row the shape the list states", () => {
    render(
      <ShownProvider value={{ boxed: true, mark: "check", mixedMark: "dash" }}>
        <Reader />
      </ShownProvider>,
    );

    expect(screen.getByTestId("shape").textContent).toBe("truecheckdash");
  });

  it("throws where a ready-made part is drawn outside a list", () => {
    expect(() => render(<Reader />)).toThrow(/Listbox/u);
  });
});
