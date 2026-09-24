import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionProvider, useSection } from "#section/state.ts";

/**
 * Renders the title id that `useSection` returns.
 *
 * @returns The title id as text.
 */
function Reader(): ReactElement {
  const section = useSection();

  return <span data-testid="held">{section.titleId}</span>;
}

describe("useSection", () => {
  it("returns the state the provider sets", () => {
    render(
      <SectionProvider value={{ narrow: false, titleId: "billing" }}>
        <Reader />
      </SectionProvider>,
    );

    expect(screen.getByTestId("held").textContent).toBe("billing");
  });

  it("throws outside a section", () => {
    expect(() => render(<Reader />)).toThrow(/Section/u);
  });
});
