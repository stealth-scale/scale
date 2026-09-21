import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette } from "#command/command.fixtures.tsx";
import { List } from "#command/list.tsx";

describe("List", () => {
  it("renders a div element for the list slot", () => {
    const { container } = render(palette(<List />));

    expect(slotElement(container, "command", "list").tagName).toBe("DIV");
  });

  it("labels the listbox with the name carried in the palette state", () => {
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

  it("builds a group id from its index rather than from its heading", () => {
    const { container } = render(composed());

    expect(container.querySelector("[role=group]")?.id).toMatch(/group-0/u);
  });

  it("renders the shortcut slot for an action that declares a shortcut", () => {
    const { container } = render(composed());

    expect(slotElement(container, "command", "shortcut").textContent).toBe("N");
  });
});
