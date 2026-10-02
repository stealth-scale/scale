import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { buttonSizeOf, PageProvider, shown, useOptionalPage, usePage } from "#page/state.ts";

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

describe("state", () => {
  it("returns the state the provider sets from usePage", () => {
    render(
      <PageProvider value={{ narrow: false, size: "lg" }}>
        <Reader />
      </PageProvider>,
    );

    expect(screen.getByTestId("size").textContent).toBe("lg");
  });

  it("throws from usePage outside a page", () => {
    expect(() => render(<Reader />)).toThrow(/Page/u);
  });

  it("returns undefined from useOptionalPage outside a page", () => {
    render(<Optional />);

    expect(screen.getByTestId("size").textContent).toBe("none");
  });

  it.each([
    [true, undefined],
    [false, undefined],
    [true, "narrow"],
    [false, "wide"],
  ] as const)("shows a part on a page narrow %s when it renders at %s", (narrow, when) => {
    expect(shown(when, narrow)).toBe(true);
  });

  it.each([
    [false, "narrow"],
    [true, "wide"],
  ] as const)("hides a part on a page narrow %s when it renders at %s", (narrow, when) => {
    expect(shown(when, narrow)).toBe(false);
  });

  it.each([
    ["lg", "lg"],
    ["md", "md"],
    ["sm", "sm"],
  ] as const)("returns the %s button on a wide page of size %s", (size, button) => {
    expect(buttonSizeOf({ narrow: false, size })).toBe(button);
  });

  it.each([
    ["lg", "md"],
    ["md", "sm"],
    ["sm", "sm"],
  ] as const)("returns one button size smaller on a narrow page of size %s", (size, button) => {
    expect(buttonSizeOf({ narrow: true, size })).toBe(button);
  });
});
