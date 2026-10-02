import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { framed, opened, picked, trigger } from "#select/select.fixtures.tsx";

/**
 * Presses a key on the open panel and waits for the machine.
 */
async function keyed(key: string): Promise<void> {
  fireEvent.keyDown(screen.getByRole("listbox"), { key });
  await settled();
  await framed();
}

/**
 * Makes the element scroll: `overflow-y: auto` around content four times its height.
 */
function overflowed(element: HTMLElement): void {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(400);
  element.style.overflowY = "auto";
}

/**
 * Returns the ID of the row the panel's highlight is on.
 */
function highlighted(): null | string {
  return screen.getByRole("listbox").getAttribute("aria-activedescendant");
}

describe("Content", () => {
  it("renders a div with role listbox", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("listbox").tagName).toBe("DIV");
  });

  it("names itself by the label", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("listbox", { name: "Account" })).toBeDefined();
  });

  it("names itself by the trigger's aria-label without a label", async () => {
    await drawn(picked({}, { labelled: false, named: "Zone" }));
    await opened();

    expect(screen.getByRole("listbox", { name: "Zone" })).toBeDefined();
  });

  it("drops aria-labelledby without a label", async () => {
    await drawn(picked({}, { labelled: false, named: "Zone" }));
    await opened();

    expect(screen.getByRole("listbox").hasAttribute("aria-labelledby")).toBe(false);
  });

  it("takes focus as it opens", async () => {
    await drawn(picked());
    await opened();

    expect(document.activeElement).toBe(screen.getByRole("listbox"));
  });

  it("moves the highlight with ArrowDown", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();
    await keyed("ArrowDown");

    expect(highlighted()).toBe(screen.getByRole("option", { name: "Halden & Co" }).id);
  });

  it("steps past a disabled row", async () => {
    await drawn(picked({ defaultValue: ["perrin partners"] }));
    await opened();
    await keyed("ArrowDown");

    expect(highlighted()).toBe(screen.getByRole("option", { name: "Perrin Freight" }).id);
  });

  it("selects the highlighted row on Enter", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();
    await keyed("ArrowDown");
    await keyed("Enter");

    expect(trigger().textContent).toBe("Halden & Co");
  });

  it("closes on Escape", async () => {
    await drawn(picked());
    await opened();
    await keyed("Escape");

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("returns focus to the trigger on Escape", async () => {
    await drawn(picked());
    await opened();
    await keyed("Escape");

    expect(document.activeElement).toBe(trigger());
  });

  it("moves focus to the trigger on Tab", async () => {
    await drawn(picked());
    await opened();
    await keyed("Tab");

    expect(document.activeElement).toBe(trigger());
  });

  it("leaves Tab to the browser", async () => {
    await drawn(picked());
    await opened();

    expect(fireEvent.keyDown(screen.getByRole("listbox"), { key: "Tab" })).toBe(true);
  });

  it("sets aria-multiselectable for several choices", async () => {
    await drawn(picked({ multiple: true }));
    await opened();

    expect(screen.getByRole("listbox").getAttribute("aria-multiselectable")).toBe("true");
  });

  it("renders the rows inside a scroll area's viewport", async () => {
    await drawn(picked());
    await opened();

    expect(slotElement(document.body, "select", "rows").parentElement).toBe(
      slotElement(document.body, "select", "viewport"),
    );
  });

  it("renders the listbox as the scroll area's viewport", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("listbox")).toBe(slotElement(document.body, "select", "viewport"));
  });

  it("sets the machine's direction on the scroll area", async () => {
    await drawn(picked({ dir: "rtl" }));
    await opened();

    expect(slotElement(document.body, "scroll-area", "root").getAttribute("dir")).toBe("rtl");
  });

  it("scrolls the row an arrow key highlights into view in the scroll area's viewport", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();
    overflowed(slotElement(document.body, "select", "viewport"));
    await keyed("ArrowDown");

    expect([reveal.mock.contexts.at(-1), reveal.mock.lastCall]).toStrictEqual([
      screen.getByRole("option", { name: "Halden & Co" }),
      [{ block: "nearest" }],
    ]);
  });

  it("leaves the document once it closes", async () => {
    await drawn(picked());
    await opened();
    await keyed("Escape");

    expect(screen.queryByRole("listbox", { hidden: true })).toBeNull();
  });

  it("renders the element as names", async () => {
    await drawn(picked({}, { panel: { as: "section" } }));
    await opened();

    expect(slotElement(document.body, "select", "content").tagName).toBe("SECTION");
  });
});
