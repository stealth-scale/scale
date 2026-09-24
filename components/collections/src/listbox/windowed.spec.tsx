import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { scrolledBy, useWindowed, type Windowed, WindowedProvider } from "#listbox/windowed.ts";

/**
 * Passes a scroll function to the provider's slot while rendering.
 *
 * @returns A `span` with a test id.
 */
function Reader(): ReactElement {
  const { hold } = useWindowed();

  hold(() => {});

  return <span data-testid="held">handed up</span>;
}

describe("useWindowed", () => {
  it("returns the provider's slot", () => {
    const hold = vi.fn<Windowed["hold"]>();

    render(
      <WindowedProvider value={{ hold }}>
        <Reader />
      </WindowedProvider>,
    );

    expect(hold).toHaveBeenCalledWith(expect.any(Function));
  });

  it("renders the component that reads it", () => {
    render(
      <WindowedProvider value={{ hold: vi.fn<Windowed["hold"]>() }}>
        <Reader />
      </WindowedProvider>,
    );

    expect(screen.getByTestId("held")).toBeTruthy();
  });

  it("throws outside a provider", () => {
    expect(() => render(<Reader />)).toThrow(/Listbox/u);
  });
});

describe("scrolledBy", () => {
  it("calls the window's function with the machine's index", () => {
    const scroll = vi.fn<(index: number) => void>();

    scrolledBy(scroll)({ index: 12 });

    expect(scroll).toHaveBeenCalledWith(12);
  });
});
