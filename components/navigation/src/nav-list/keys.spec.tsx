import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { Branch } from "#nav-list/branch.tsx";
import { Content } from "#nav-list/content.tsx";
import { Item } from "#nav-list/item.ts";
import { Link } from "#nav-list/link.ts";
import { composed } from "#nav-list/nav-list.fixtures.tsx";
import { Root, type RootProps } from "#nav-list/root.tsx";
import { Trigger } from "#nav-list/trigger.tsx";

/**
 * Presses a key on a row, the way a reader on that row presses it.
 */
function typed(row: HTMLElement, key: string, held: Record<string, boolean> = {}): void {
  row.focus();
  fireEvent.keyDown(row, { key, ...held });
}

/**
 * Draws the list with a branch a case can open, so the rows under it can be stepped into.
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
  it("moves to the next row on the down arrow", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("moves to the row above on the up arrow", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Invoices" }), "ArrowUp");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("stops on the last row rather than starting again at the first", () => {
    render(composed());
    typed(screen.getByRole("button", { name: "Settings" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  });

  it("stops on the first row rather than starting again at the last", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowUp");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("moves to the first row on Home", () => {
    render(composed());
    typed(screen.getByRole("button", { name: "Settings" }), "Home");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("moves to the last row on End", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "End");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  });

  it("steps past the rows of a branch that is closed", () => {
    opening();
    typed(screen.getByRole("link", { name: "Overview" }), "End");

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Settings" }));
  });

  it("steps into the rows of a branch that has opened", async () => {
    opening();
    await pressed(screen.getByRole("button", { name: "Settings" }));
    typed(screen.getByRole("button", { name: "Settings" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Team" }));
  });

  it("moves from a press that came up through a mark inside a row", () => {
    render(composed());
    screen.getByRole("button", { name: "Settings" }).focus();
    fireEvent.keyDown(screen.getByText("v"), { key: "ArrowUp" });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("steps the other way along the line where the writing runs right to left", () => {
    render(composed({ dir: "rtl", style: { direction: "rtl" }, variant: "dock" }));
    typed(screen.getByRole("link", { name: "Invoices" }), "ArrowRight");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("answers the arrows along the line where the rows run along it", () => {
    render(composed({ variant: "dock" }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowRight");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });

  it("leaves the down arrow alone where the rows run along the line", () => {
    render(composed({ variant: "dock" }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("leaves the arrows along the line alone where the rows run down the page", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowRight");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("leaves a key it answers none of alone", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "a");

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("leaves an arrow held with a modifier alone", () => {
    render(composed());
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown", { ctrlKey: true });

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("leaves an arrow pressed on no row at all alone", () => {
    const { container } = render(composed());
    const list = container.querySelector("ul");

    fireEvent.keyDown(list as HTMLElement, { key: "ArrowDown" });

    expect(document.activeElement).toBe(document.body);
  });

  it("leaves an arrow a caller's own handler has taken alone", () => {
    const heard = vi.fn((event: { preventDefault: () => void }) => {
      event.preventDefault();
    });

    render(composed({ onKeyDown: heard }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(heard).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Overview" }));
  });

  it("runs a caller's own handler beside its own", () => {
    const heard = vi.fn<() => void>();

    render(composed({ onKeyDown: heard }));
    typed(screen.getByRole("link", { name: "Overview" }), "ArrowDown");

    expect(heard).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Invoices" }));
  });
});
