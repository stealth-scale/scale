import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageProvider, shown, useOptionalPage, usePage } from "#page/state.ts";

/**
 * Renders the size that `usePage` returns.
 *
 * @returns The size as text.
 */
function Reader(): ReactElement {
  const page = usePage();

  return <span data-testid="size">{page.size}</span>;
}

/**
 * Renders the size that `useOptionalPage` returns, or `none` outside a page.
 *
 * @returns The size as text.
 */
function Optional(): ReactElement {
  const page = useOptionalPage();

  return <span data-testid="size">{page?.size ?? "none"}</span>;
}

describe("usePage", () => {
  it("returns the state the provider sets", () => {
    render(
      <PageProvider value={{ narrow: false, size: "lg" }}>
        <Reader />
      </PageProvider>,
    );

    expect(screen.getByTestId("size").textContent).toBe("lg");
  });

  it("throws outside a page", () => {
    expect(() => render(<Reader />)).toThrow(/Page/u);
  });
});

describe("useOptionalPage", () => {
  it("returns undefined from useOptionalPage outside a page", () => {
    render(<Optional />);

    expect(screen.getByTestId("size").textContent).toBe("none");
  });
});

describe("shown", () => {
  it("shows a part at every width without when", () => {
    expect(shown(undefined, true)).toBe(true);
    expect(shown(undefined, false)).toBe(true);
  });

  it("shows a narrow part on a folded page alone", () => {
    expect(shown("narrow", true)).toBe(true);
    expect(shown("narrow", false)).toBe(false);
  });

  it("hides a wide part on a folded page", () => {
    expect(shown("wide", true)).toBe(false);
    expect(shown("wide", false)).toBe(true);
  });
});
