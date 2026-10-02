import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createFilterScope, FilterContext } from "@stealthscale/hooks";
import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#nav-list/item.tsx";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Item", () => {
  it("renders an LI element inside a list", () => {
    const { container } = render(listed(<Item>Overview</Item>));

    expect(slotElement(container, "nav-list", "item").tagName).toBe("LI");
  });

  it("hides the row while the query of its scope is not in its words", () => {
    const scope = createFilterScope();

    render(<FilterContext value={scope}>{listed(<Item>Overview</Item>)}</FilterContext>);
    act(() => {
      scope.setQuery("invoices");
    });

    expect(screen.getByRole("listitem", { hidden: true }).hasAttribute("hidden")).toBe(true);
  });

  it("shows the row while the query of its scope is in its words", () => {
    const scope = createFilterScope();

    render(<FilterContext value={scope}>{listed(<Item>Overview</Item>)}</FilterContext>);
    act(() => {
      scope.setQuery("over");
    });

    expect(screen.getByRole("listitem").hasAttribute("hidden")).toBe(false);
  });

  it("keeps the hidden attribute a caller sets", () => {
    render(listed(<Item hidden>Overview</Item>));

    expect(screen.getByRole("listitem", { hidden: true }).hasAttribute("hidden")).toBe(true);
  });
});
