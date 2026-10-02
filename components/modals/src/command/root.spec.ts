import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, pressed, settled } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#command/command.fixtures.tsx";
import { recipe } from "#command/recipe.ts";
import { type RootProps } from "#command/root.tsx";

/**
 * Describes the props a case sets: the root's props without the two the fixture sets.
 */
type Settings = Omit<RootProps, "actions" | "aria-label">;

/**
 * Waits for the next animation frame, in which the machine reveals the highlighted row.
 */
async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

describe("Root", () => {
  it("passes axe with every part", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props: Settings) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div", () => {
    const { container } = render(composed());

    expect(slotElement(container, "command", "root").tagName).toBe("DIV");
  });

  it("passes its aria-label down to the listbox", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Commands" })).toBeTruthy();
  });

  it("renders one option per action before any query is typed", () => {
    render(composed());

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onRun with the value of the action that was chosen", async () => {
    const heard = vi.fn<(value: string) => void>();

    render(composed({ onRun: heard }));
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(heard).toHaveBeenCalledWith("invoices");
  });

  it("scrolls the row an arrow key highlights into view in the listbox's viewport", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(400);
    const { container } = render(composed());
    slotElement(container, "listbox", "viewport").style.overflowY = "auto";
    act(() => {
      screen.getByRole("textbox", { name: "Type a command" }).focus();
    });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Type a command" }), {
      key: "ArrowDown",
    });
    await settled();
    await frame();

    expect([reveal.mock.contexts.at(-1), reveal.mock.lastCall]).toStrictEqual([
      screen.getByRole("option", { name: "Invoices" }),
      [{ block: "nearest" }],
    ]);
  });

  it("leaves aria-selected false on an option after it has been chosen", async () => {
    render(composed());
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });
});
