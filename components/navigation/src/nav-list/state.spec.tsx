import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DefaultsContext, ListProvider, useDefaults, useList } from "#nav-list/state.ts";

/**
 * Renders whether the list around it is iconic.
 */
function Row(): ReactElement {
  const { iconic } = useList();

  return <span data-testid="iconic">{String(iconic)}</span>;
}

/**
 * Renders the size the defaults set, or `none`.
 */
function Sized(): ReactElement {
  return <span data-testid="size">{useDefaults().size ?? "none"}</span>;
}

describe("state", () => {
  it("returns the state the list provides from useList", () => {
    render(
      <ListProvider value={{ iconic: true }}>
        <Row />
      </ListProvider>,
    );

    expect(screen.getByTestId("iconic").textContent).toBe("true");
  });

  it("throws from useList outside a list", () => {
    expect(() => render(<Row />)).toThrow(/NavList/u);
  });

  it("returns the defaults a provider sets from useDefaults", () => {
    render(
      <DefaultsContext value={{ size: "sm" }}>
        <Sized />
      </DefaultsContext>,
    );

    expect(screen.getByTestId("size").textContent).toBe("sm");
  });

  it("returns no defaults outside a provider", () => {
    render(<Sized />);

    expect(screen.getByTestId("size").textContent).toBe("none");
  });
});
