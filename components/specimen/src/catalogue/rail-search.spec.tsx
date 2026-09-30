import { type ReactElement } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavList } from "@stealthscale/component-navigation";
import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { pressed } from "@stealthscale/testing-react";

import { RailSearch, type RailSearchProps } from "#catalogue/rail-search.tsx";

/**
 * Renders the search above a block of two pages, in a shell whose navigation a trigger opens and
 * closes.
 */
function Searched(props: RailSearchProps): ReactElement {
  return (
    <AppShell.Root>
      <AppShell.Header>
        <AppShell.Trigger>Navigation</AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar>
          <Sidebar.Root>
            <Sidebar.Header>
              <RailSearch {...props} />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Nav aria-label="Catalogue">
                <NavList.Root>
                  <NavList.Item>
                    <NavList.Link href="/components/actions/button">Button</NavList.Link>
                  </NavList.Item>
                  <NavList.Item>
                    <NavList.Link href="/components/data/badge">Badge</NavList.Link>
                  </NavList.Item>
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main />
      </AppShell.Body>
    </AppShell.Root>
  );
}

describe("RailSearch", () => {
  it("names the field Filter pages", () => {
    render(<Searched />);

    expect(screen.getByRole("searchbox", { name: "Filter pages" })).toBeDefined();
  });

  it("takes the name the caller passes as aria-label", () => {
    render(<Searched aria-label="Search the docs" />);

    expect(screen.getByRole("searchbox", { name: "Search the docs" })).toBeDefined();
  });

  it("renders the clear control once the field has a value", () => {
    render(<Searched />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bad" } });

    expect(screen.getByRole("button", { name: "Clear the filter" })).toBeDefined();
  });

  it("hides a page whose title does not contain the query", () => {
    render(<Searched />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "bad" } });

    expect(screen.queryByRole("link", { name: "Button" })).toBeNull();
  });

  it("sets aria-keyshortcuts to the platform's modifier and K", () => {
    render(<Searched />);

    expect(screen.getByRole("searchbox").getAttribute("aria-keyshortcuts")).toBe(
      "Control+K Meta+K",
    );
  });

  it("moves focus to the field on the platform's modifier and K", () => {
    render(<Searched />);

    fireEvent.keyDown(document.body, { ctrlKey: true, key: "k" });

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("opens a closed navigation on the platform's modifier and K", async () => {
    render(<Searched />);

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-expanded")).toBe(
      "false",
    );

    await act(() => {
      fireEvent.keyDown(document.body, { ctrlKey: true, key: "k" });

      return Promise.resolve();
    });

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("moves focus to the first page on the down arrow", () => {
    render(<Searched />);

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "ArrowDown" });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Button" }));
  });
});
