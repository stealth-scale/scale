import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { Branch } from "#nav-list/branch.tsx";
import { Content } from "#nav-list/content.tsx";
import { Item } from "#nav-list/item.tsx";
import { Link } from "#nav-list/link.tsx";
import { composed } from "#nav-list/nav-list.fixtures.tsx";
import { Root, type RootProps } from "#nav-list/root.tsx";
import { Trigger } from "#nav-list/trigger.tsx";

/**
 * Focuses a row and fires a keydown event on it.
 */
function typed(row: HTMLElement, key: string, held: Record<string, boolean> = {}): void {
  row.focus();
  fireEvent.keyDown(row, { key, ...held });
}

/**
 * Renders a list with one link and a closed branch holding one nested link.
 */
function opening(props: RootProps = {}): ReturnType<typeof render> {
  return render(
    <Root {...props}>
      <Item>
        <Link href="/">Overview</Link>
      </Item>
      <Branch>
        <Trigger>Settings</Trigger>
        <Content>
          <Item>
            <Link href="/settings/team">Team</Link>
          </Item>
        </Content>
      </Branch>
    </Root>,
  );
}

describe("useRowKeys", () => {
  it("moves focus to the next row on ArrowDown", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("moves focus to the previous row on ArrowUp", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Invoices" }), "ArrowUp");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("keeps focus on the last row on ArrowDown", () => {
    render(composed());
    typed(screen.getByRole("button", { name: "Settings" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  });

  it("keeps focus on the first row on ArrowUp", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowUp");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("moves focus to the first row on Home", () => {
    render(composed());
    typed(screen.getByRole("button", { name: "Settings" }), "Home");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("moves focus to the last row on End", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "End");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  });

  it("skips the rows of a closed branch", () => {
    opening();
    typed(screen.getByRole("link", { name: "Overview" }), "End");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  });

  it("includes the rows of a branch that has opened", async () => {
    opening();
    await pressed(screen.getByRole("button", { name: "Settings" }));
    typed(screen.getByRole("button", { name: "Settings" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Team" }));
  });

  it("moves focus when the keydown comes from an element inside the row", () => {
    render(composed());
    screen.getByRole("button", { name: "Settings" }).focus();
    fireEvent.keyDown(screen.getByText("v"), { key: "ArrowUp" });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("moves focus backwards on ArrowRight in a right-to-left dock", () => {
    render(composed({ dir: "rtl", style: { direction: "rtl" }, variant: "dock" }));
    typed(screen.getByRole("link", { name: "Invoices" }), "ArrowRight");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("moves focus to the next row on ArrowRight in the dock", () => {
    render(composed({ variant: "dock" }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowRight");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("ignores ArrowDown in the dock", () => {
    render(composed({ variant: "dock" }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("ignores ArrowRight in the list variant", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowRight");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("ignores a key it does not handle", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "a");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("ignores an arrow key pressed with a modifier", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown", { ctrlKey: true });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("ignores an arrow key when no row has focus", () => {
    const { container } = render(composed());
    const list = container.querySelector("ul");

    fireEvent.keyDown(list as HTMLElement, { key: "ArrowDown" });

    expect(document.activeElement).toBe(document.body);
  });

  it("ignores an arrow key the caller's handler prevented", () => {
    const heard = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault();
    });

    render(composed({ onKeyDown: heard }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(heard).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("calls the caller's onKeyDown handler when it moves focus", () => {
    const heard = vi.fn<() => void>();

    render(composed({ onKeyDown: heard }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(heard).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });
});
