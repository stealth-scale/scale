import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Search } from "#toolbar/search.tsx";
import { ranged, searched } from "#toolbar/toolbar.fixtures.tsx";

describe("Search", () => {
  it("renders a div", () => {
    const { container } = render(ranged(<Search>field</Search>));

    expect(slotElement(container, "toolbar", "search").tagName).toBe("DIV");
  });

  it("sets no data-opened while closed", () => {
    const { container } = render(ranged(<Search>field</Search>));

    expect(slotElement(container, "toolbar", "search").dataset["opened"]).toBeUndefined();
  });

  it("sets data-opened while open", () => {
    const { container } = render(ranged(<Search opened>field</Search>));

    expect(slotElement(container, "toolbar", "search").dataset["opened"]).toBe("");
  });

  it("focuses the field when it opens", () => {
    render(searched(true));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("moves no focus while closed", () => {
    render(searched(false));

    expect(document.activeElement).toBe(document.body);
  });

  it("returns focus to the control that opened it", () => {
    const { rerender } = render(searched(false));

    screen.getByRole("button", { name: "Open the search" }).focus();
    rerender(searched(true));
    rerender(searched(false));

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open the search" }));
  });
});
