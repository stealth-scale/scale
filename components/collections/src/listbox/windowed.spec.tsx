import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { scrolledBy, useWindowed, type Windowed, WindowedProvider } from "#listbox/windowed.ts";

/**
 * Hands a way of scrolling up to the list above it and says it did.
 *
 * @returns A note that the way was handed up.
 */
function Reader(): ReactElement {
  const { hold } = useWindowed();

  hold(() => {});

  return <span data-testid="held">handed up</span>;
}

describe("useWindowed", () => {
  it("hands a window's way of scrolling up to the list", () => {
    const hold = vi.fn<Windowed["hold"]>();

    render(
      <WindowedProvider value={{ hold }}>
        <Reader />
      </WindowedProvider>,
    );

    expect(hold).toHaveBeenCalledWith(expect.any(Function));
  });

  it("draws the window that handed it up", () => {
    render(
      <WindowedProvider value={{ hold: vi.fn<Windowed["hold"]>() }}>
        <Reader />
      </WindowedProvider>,
    );

    expect(screen.getByTestId("held")).toBeTruthy();
  });

  it("throws where a window is drawn outside a list", () => {
    expect(() => render(<Reader />)).toThrow(/Listbox/u);
  });
});

describe("scrolledBy", () => {
  it("hands the machine's position on to the window that knows the distance", () => {
    const scroll = vi.fn<(index: number) => void>();

    scrolledBy(scroll)({ index: 12 });

    expect(scroll).toHaveBeenCalledWith(12);
  });
});
