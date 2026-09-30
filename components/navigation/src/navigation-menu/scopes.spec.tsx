import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AlignProvider,
  ItemProvider,
  LeavingProvider,
  useAlign,
  useClosesOnLeave,
  useItem,
} from "#navigation-menu/scopes.ts";

/**
 * Renders the alignment and whether a panel closes on leave, so a case can read them off the
 * screen.
 *
 * @returns The two readings.
 */
function Probe(): ReactElement {
  return <span data-testid="read">{`${useAlign() ?? "none"} ${String(useClosesOnLeave())}`}</span>;
}

/**
 * Renders the value of the item above it.
 *
 * @returns The value.
 */
function Valued(): ReactElement {
  return <span data-testid="item">{useItem().value}</span>;
}

describe("scopes", () => {
  it("returns no alignment and closing on leave outside every provider", () => {
    render(<Probe />);

    expect(screen.getByTestId("read").textContent).toBe("none true");
  });

  it("returns the alignment the positioner provides", () => {
    render(
      <AlignProvider value="end">
        <Probe />
      </AlignProvider>,
    );

    expect(screen.getByTestId("read").textContent).toBe("end true");
  });

  it("returns false for closing on leave under a provider that turns it off", () => {
    render(
      <LeavingProvider value={false}>
        <Probe />
      </LeavingProvider>,
    );

    expect(screen.getByTestId("read").textContent).toBe("none false");
  });

  it("returns the item the provider holds", () => {
    render(
      <ItemProvider value={{ value: "products" }}>
        <Valued />
      </ItemProvider>,
    );

    expect(screen.getByTestId("item").textContent).toBe("products");
  });

  it("throws for a reader outside an item", () => {
    expect(() => render(<Valued />)).toThrow(
      "A part of NavigationMenu.Item was drawn outside the root that holds it together.",
    );
  });
});
