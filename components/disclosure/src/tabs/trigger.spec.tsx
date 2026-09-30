import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { type CloseDetails } from "#tabs/closing.ts";
import { List } from "#tabs/list.tsx";
import { recipe } from "#tabs/recipe.ts";
import { Root, type RootProps } from "#tabs/root.tsx";
import { closable, composed, tabbed } from "#tabs/tabs.fixtures.tsx";
import { Trigger } from "#tabs/trigger.tsx";

/**
 * Returns the tab with a name.
 */
function tab(name: string): HTMLElement {
  return screen.getByRole("tab", { name });
}

/**
 * Focuses the tab with a name, as the arrow keys would.
 */
function focused(name: string): HTMLElement {
  const target = tab(name);

  act(() => {
    target.focus();
  });

  return target;
}

/**
 * Dispatches an `auxclick` of a mouse button on an element, and returns whether it was not
 * cancelled.
 */
function auxClicked(element: HTMLElement, button: number): boolean {
  return fireEvent(
    element,
    new MouseEvent("auxclick", { bubbles: true, button, cancelable: true }),
  );
}

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(tabbed(<Trigger value="first">First</Trigger>));

    expect(slotElement(container, "tabs", "trigger").tagName).toBe("BUTTON");
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "trigger" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("sets aria-selected on the selected tab alone", async () => {
    await drawn(composed());

    expect(tab("First").getAttribute("aria-selected")).toBe("true");
    expect(tab("Second").getAttribute("aria-selected")).toBe("false");
  });

  it("sets aria-controls", async () => {
    await drawn(composed());

    expect(tab("First").getAttribute("aria-controls")).toBeTruthy();
  });

  it("puts the selected tab alone in the tab order", async () => {
    await drawn(composed());

    expect(tab("First").getAttribute("tabindex")).toBe("0");
    expect(tab("Second").getAttribute("tabindex")).toBe("-1");
  });

  it("sets disabled", async () => {
    await drawn(composed());

    expect(tab("Third").hasAttribute("disabled")).toBe(true);
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(
      tabbed(
        <Trigger onClick={heard} value="first">
          First
        </Trigger>,
      ),
    );
    fireEvent.click(tab("First"));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });

  it("sets aria-keyshortcuts to Delete on a closable tab", async () => {
    await drawn(closable());

    expect(tab("first").getAttribute("aria-keyshortcuts")).toBe("Delete");
  });

  it("sets no aria-keyshortcuts on a tab that is not closable", async () => {
    await drawn(composed());

    expect(tab("First").hasAttribute("aria-keyshortcuts")).toBe(false);
  });

  it("closes the focused closable tab on Delete", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    fireEvent.keyDown(focused("second"), { key: "Delete" });
    await settled();

    expect(onClose).toHaveBeenCalledExactlyOnceWith({ value: "second" });
  });

  it("cancels Delete on a closable tab", async () => {
    await drawn(closable());

    const uncancelled = fireEvent.keyDown(focused("second"), { key: "Delete" });

    await settled();

    expect(uncancelled).toBe(false);
  });

  it("leaves Delete to the browser on a tab that is not closable", async () => {
    await drawn(composed());

    const uncancelled = fireEvent.keyDown(focused("First"), { key: "Delete" });

    await settled();

    expect(uncancelled).toBe(true);
  });

  it("ignores Backspace on a closable tab", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    fireEvent.keyDown(focused("second"), { key: "Backspace" });
    await settled();

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes a closable tab on a middle click", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    auxClicked(tab("first"), 1);
    await settled();

    expect(onClose).toHaveBeenCalledExactlyOnceWith({ value: "first" });
  });

  it("cancels a middle click on a closable tab", async () => {
    await drawn(closable());

    const uncancelled = auxClicked(tab("first"), 1);

    await settled();

    expect(uncancelled).toBe(false);
  });

  it("ignores a secondary click on a closable tab", async () => {
    const onClose = vi.fn<(details: CloseDetails) => void>();

    await drawn(closable({ onClose }));
    auxClicked(tab("first"), 2);
    await settled();

    expect(onClose).not.toHaveBeenCalled();
  });

  it("scrolls the selected tab into its scroller", async () => {
    await drawn(
      <Root defaultValue="first">
        <div data-testid="scroller" style={{ overflowX: "auto" }}>
          <List>
            <Trigger value="first">First</Trigger>
            <Trigger value="second">Second</Trigger>
          </List>
        </div>
      </Root>,
    );

    const scroller = screen.getByTestId("scroller");

    Object.defineProperty(scroller, "clientWidth", { value: 200 });
    Object.defineProperty(scroller, "scrollWidth", { value: 600 });
    Object.defineProperty(scroller, "scrollLeft", { value: 0, writable: true });
    vi.spyOn(scroller, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 40));
    vi.spyOn(tab("Second"), "getBoundingClientRect").mockReturnValue(new DOMRect(300, 0, 80, 40));
    fireEvent.click(tab("Second"));
    await settled();

    expect(scroller.scrollLeft).toBe(180);
  });
});
