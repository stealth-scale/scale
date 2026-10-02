import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, frame, keyed, panel, placed } from "#floating-panel/floating-panel.fixtures.tsx";

/**
 * Returns a button by its name.
 *
 * @param name - The button's accessible name.
 */
function button(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

describe("Content", () => {
  it("renders a div with the content class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "floating-panel", "content").tagName).toBe("DIV");
  });

  it("is a dialog named by its title", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog", { name: "Launch notes" })).toBeDefined();
  });

  it("leaves aria-modal unset", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(panel().hasAttribute("aria-modal")).toBe(false);
  });

  it("sets data-state to open while the panel is open", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(panel().dataset["state"]).toBe("open");
  });

  it("moves focus to the panel when it opens", async () => {
    await drawn(composed());
    await pressed(button("Notes"));
    await frame();

    expect(document.activeElement).toBe(panel());
  });

  it("returns focus to the trigger when it closes", async () => {
    await drawn(composed());
    await pressed(button("Notes"));
    await frame();
    await pressed(button("Close"));
    await frame();

    expect(document.activeElement).toBe(button("Notes"));
  });

  it("moves Tab from the trigger to the panel", async () => {
    await drawn(composed({ defaultOpen: true }));
    await frame();
    act(() => {
      button("Notes").focus();
    });
    fireEvent.keyDown(button("Notes"), { key: "Tab" });

    expect(document.activeElement).toBe(panel());
  });

  it("moves Tab from the panel's last control to the control after the trigger", async () => {
    await drawn(composed({ defaultOpen: true }));
    await frame();
    act(() => {
      screen.getByRole("textbox", { name: "Note" }).focus();
    });
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Note" }), { key: "Tab" });

    expect(document.activeElement).toBe(button("After"));
  });

  it("moves Shift+Tab from the panel to the trigger", async () => {
    await drawn(composed({ defaultOpen: true }));
    await frame();
    act(() => {
      panel().focus();
    });
    fireEvent.keyDown(panel(), { key: "Tab", shiftKey: true });

    expect(document.activeElement).toBe(button("Notes"));
  });

  it("moves the panel by the arrow keys", async () => {
    await drawn(composed({ defaultOpen: true, defaultPosition: { x: 100, y: 100 } }));
    await keyed(panel(), { key: "ArrowRight" });

    expect(placed().x).toBe(101);
  });

  it("calls the caller's onKeyDown", async () => {
    const pressedKey = vi.fn<(key: string) => void>();

    await drawn(
      composed(
        { defaultOpen: true },
        {
          onKeyDown: (event) => {
            pressedKey(event.key);
          },
        },
      ),
    );
    await keyed(panel(), { key: "ArrowRight" });

    expect(pressedKey).toHaveBeenLastCalledWith("ArrowRight");
  });
});
