import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { buttonSizeOf, SectionProvider, useSection } from "#section/state.ts";

/**
 * Renders the title id that `useSection` returns.
 *
 * @returns The title id as text.
 */
function Reader(): ReactElement {
  const section = useSection();

  return <span data-testid="held">{section.titleId}</span>;
}

describe("state", () => {
  it("returns the state the provider sets from useSection", () => {
    render(
      <SectionProvider
        value={{ narrow: false, setTitled: () => {}, size: "md", titleId: "billing" }}
      >
        <Reader />
      </SectionProvider>,
    );

    expect(screen.getByTestId("held").textContent).toBe("billing");
  });

  it("throws from useSection outside a section", () => {
    expect(() => render(<Reader />)).toThrow(/Section/u);
  });

  it.each([
    ["lg", "md"],
    ["md", "sm"],
    ["sm", "xs"],
  ] as const)("returns one button size smaller than a section of size %s", (size, button) => {
    expect(buttonSizeOf(size)).toBe(button);
  });
});
