import { type ReactElement, useState } from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell, Sidebar } from "@stealthscale/component-screen";
import { type Hotkey } from "@stealthscale/provider-hotkeys";
import { pressed } from "@stealthscale/testing-react";

import { RailSearch } from "#catalogue/rail-search.tsx";

/**
 * Draws the search in a shell whose navigation a trigger opens and closes, beside an output
 * reporting the words typed.
 */
function Searched({
  panel,
  shortcut,
}: {
  readonly panel?: string;
  readonly shortcut?: Hotkey;
}): ReactElement {
  const [query, setQuery] = useState("");

  return (
    <AppShell.Root>
      <AppShell.Header>
        <AppShell.Trigger {...(panel === undefined ? {} : { panel })}>Navigation</AppShell.Trigger>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar {...(panel === undefined ? {} : { name: panel })}>
          <Sidebar.Root>
            <Sidebar.Header>
              <RailSearch
                onValueChange={setQuery}
                panel={panel}
                shortcut={shortcut}
                value={query}
              />
            </Sidebar.Header>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main>
          <output>{query}</output>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}

describe("RailSearch", () => {
  it("draws a search box named for the filter", () => {
    render(<Searched />);

    expect(screen.getByRole("searchbox", { name: "Filter pages" })).toBeDefined();
  });

  it("reports the words a reader types", () => {
    render(<Searched />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "but" } });

    expect(screen.getByRole("status").textContent).toBe("but");
  });

  it("draws the control that empties the field once words are typed", () => {
    render(<Searched />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "but" } });

    expect(screen.getByRole("button", { name: "Clear the filter" })).toBeDefined();
  });

  it("states the shortcut on the field", () => {
    render(<Searched />);

    expect(screen.getByRole("searchbox").getAttribute("aria-keyshortcuts")).toBe(
      "Control+K Meta+K",
    );
  });

  it("states and follows the shortcut a caller names instead", () => {
    render(<Searched shortcut="Mod+Shift+F" />);

    expect(screen.getByRole("searchbox").getAttribute("aria-keyshortcuts")).toBe(
      "Control+Shift+F Meta+Shift+F",
    );

    fireEvent.keyDown(document.body, { ctrlKey: true, key: "k" });

    expect(document.activeElement).not.toBe(screen.getByRole("searchbox"));

    fireEvent.keyDown(document.body, { ctrlKey: true, key: "F", shiftKey: true });

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("states a shortcut without the platform's modifier as written", () => {
    render(<Searched shortcut="F3" />);

    expect(screen.getByRole("searchbox").getAttribute("aria-keyshortcuts")).toBe("F3");
  });

  it("opens the panel a caller names before putting the reader in the field", async () => {
    render(<Searched panel="tools" />);

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

  it("puts the reader in the field when the modifier and K are pressed", () => {
    render(<Searched />);

    fireEvent.keyDown(document.body, { ctrlKey: true, key: "k" });

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("opens a closed navigation before putting the reader in the field", async () => {
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
    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });
});
