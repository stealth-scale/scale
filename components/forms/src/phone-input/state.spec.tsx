import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhoningProvider, usePhoning, usePicking } from "#phone-input/state.ts";

/**
 * Renders the text and the country the root above passes.
 */
function Reading(): ReactElement {
  const { country, text } = usePhoning();

  return <span data-testid="phoning">{`${String(country)} ${text}`}</span>;
}

/**
 * Reports a picker to the root above.
 */
function Picking(): null {
  usePicking();

  return null;
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <PhoningProvider
        value={{
          countries: [],
          country: "NL",
          edit: () => {},
          pick: () => {},
          text: "06 12345678",
        }}
      >
        <Reading />
      </PhoningProvider>,
    );

    expect(screen.getByTestId("phoning").textContent).toBe("NL 06 12345678");
  });

  it("throws for a part outside a root", () => {
    expect(() => render(<Reading />)).toThrow(/PhoneInput\.Root/u);
  });

  it("throws for a picker outside a root", () => {
    expect(() => render(<Picking />)).toThrow(/PhoneInput\.Root/u);
  });
});
