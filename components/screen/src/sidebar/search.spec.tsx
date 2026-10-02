import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#app-shell/body.tsx";
import { Navbar } from "#app-shell/navbar.tsx";
import { Root as Shell } from "#app-shell/root.tsx";
import { Search } from "#sidebar/search.tsx";
import { aside, filtered } from "#sidebar/sidebar.fixtures.tsx";

/**
 * Renders the filtering sidebar in a shell panel beside the page that starts closed.
 */
function closed(): React.ReactElement {
  return (
    <Shell>
      <Body>
        <Navbar defaultOpen={false}>{filtered()}</Navbar>
      </Body>
    </Shell>
  );
}

/**
 * Renders the filtering sidebar in a shell panel closed to icons.
 */
function railed(): React.ReactElement {
  return (
    <Shell>
      <Body>
        <Navbar collapse="icons" defaultOpen={false}>
          {filtered()}
        </Navbar>
      </Body>
    </Shell>
  );
}

/**
 * Reads the words of the rows that are not hidden.
 */
function shown(): ReadonlyArray<null | string> {
  return screen
    .getAllByRole("listitem", { hidden: true })
    .filter((row) => !row.hasAttribute("hidden"))
    .map((row) => row.textContent);
}

describe("Search", () => {
  it("renders a div inside the root", () => {
    const { container } = render(aside(<Search />));

    expect(slotElement(container, "sidebar", "search").tagName).toBe("DIV");
  });

  it("renders the field passed as a child", () => {
    const { container } = render(
      aside(
        <Search>
          <input aria-label="Search projects" type="search" />
        </Search>,
      ),
    );

    expect(slotElement(container, "sidebar", "search").querySelector("input")).not.toBeNull();
  });

  it("renders a field named by aria-label", () => {
    render(filtered());

    expect(screen.getByRole("searchbox", { name: "Search pages" })).toBeTruthy();
  });

  it("names the field Search by default", () => {
    render(aside(<Search />));

    expect(screen.getByRole("searchbox", { name: "Search" })).toBeTruthy();
  });

  it("moves focus to the first shown row on the down arrow", () => {
    render(filtered());

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "ArrowDown" });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("skips a row the query hides on the down arrow", () => {
    render(filtered());
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "cust" } });

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "ArrowDown" });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Customers" }));
  });

  it("keeps focus in the field on the down arrow while no row is shown", () => {
    render(filtered());
    const field = screen.getByRole("searchbox");

    field.focus();
    fireEvent.change(field, { target: { value: "zebra" } });
    fireEvent.keyDown(field, { key: "ArrowDown" });

    expect(document.activeElement).toBe(field);
  });

  it("calls the caller's onKeyDown", () => {
    const onKeyDown = vi.fn<() => void>();

    render(aside(<Search onKeyDown={onKeyDown} />));
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "a" });

    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it("opens a closed panel and focuses the field on the shortcut", () => {
    render(closed());

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("hides a row whose words do not contain what is typed", () => {
    render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "cust" } });

    expect(shown()).toStrictEqual(["Customers"]);
  });

  it("shows every row again when the field is emptied", () => {
    render(filtered());

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "cust" } });
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });

    expect(shown()).toStrictEqual(["Invoices", "Customers"]);
  });

  it("sets aria-keyshortcuts from the shortcut", () => {
    render(filtered());

    expect(screen.getByRole("searchbox").getAttribute("aria-keyshortcuts")).toBe(
      "Control+K Meta+K",
    );
  });

  it("moves focus to the field on the shortcut", () => {
    render(filtered());

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("ignores the key without the modifier", () => {
    render(filtered());

    fireEvent.keyDown(document, { key: "k" });

    expect(document.activeElement).toBe(document.body);
  });

  it("renders a button named by the label on a rail in a panel", () => {
    render(railed());

    expect(screen.getByRole("button", { name: "Search pages" })).toBeTruthy();
  });

  it("opens the panel and focuses the field when the rail's button is pressed", () => {
    render(railed());

    fireEvent.click(screen.getByRole("button", { name: "Search pages" }));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("renders nothing on a rail outside a panel", () => {
    const { container } = render(filtered({ iconic: true }));

    expect(container.querySelector(".sidebar__search")).toBeNull();
  });

  it("renders nothing on a rail for a caller's field", () => {
    const { container } = render(
      aside(
        <Search>
          <input aria-label="Search projects" type="search" />
        </Search>,
        { iconic: true },
      ),
    );

    expect(container.querySelector(".sidebar__search")).toBeNull();
  });
});
