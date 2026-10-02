import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette } from "#command/command.fixtures.tsx";
import { List } from "#command/list.tsx";
import { LISTBOX } from "#command/recipe.ts";

describe("List", () => {
  it("renders a div", () => {
    const { container } = render(palette(<List />));

    expect(slotElement(container, "command", "list").tagName).toBe("DIV");
  });

  it("renders the listbox rows the recipe selects inside the list", () => {
    const { container } = render(composed());

    expect(
      slotElement(container, "command", "list").contains(slotElement(container, LISTBOX, "rows")),
    ).toBe(true);
  });

  it("labels the listbox with the palette's aria-label", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Commands" })).toBeTruthy();
  });

  it("labels a group with the heading its actions declare", () => {
    render(composed());

    expect(screen.getByRole("group", { name: "Go to" })).toBeTruthy();
  });

  it("renders a group for the ungrouped actions alongside the named one", () => {
    render(composed());

    expect(screen.getAllByRole("group")).toHaveLength(2);
  });

  it("builds a group id from the group's index", () => {
    const { container } = render(composed());

    expect(container.querySelector("[role=group]")?.id).toMatch(/group-0/u);
  });

  it("renders the shortcut slot for an action that declares a shortcut", () => {
    const { container } = render(composed());

    expect(slotElement(container, "command", "shortcut").textContent).toBe("N");
  });
});
