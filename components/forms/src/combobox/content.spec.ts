import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { keyed, opened, picked, typed } from "#combobox/combobox.fixtures.tsx";

/**
 * Makes the element scroll: `overflow-y: auto` around content four times its height.
 */
function overflowed(element: HTMLElement): void {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(400);
  element.style.overflowY = "auto";
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

  it("names itself by the input's aria-label without a label", async () => {
    await drawn(picked({}, { labelled: false, named: "Account" }));
    await opened();

    expect(screen.getByRole("listbox").getAttribute("aria-label")).toBe("Account");
  });

  it("drops aria-labelledby without a label", async () => {
    await drawn(picked({}, { labelled: false, named: "Account" }));
    await opened();

    expect(screen.getByRole("listbox").hasAttribute("aria-labelledby")).toBe(false);
  });

  it("sets aria-multiselectable for several choices", async () => {
    await drawn(picked({ multiple: true }));
    await opened();

    expect(screen.getByRole("listbox").getAttribute("aria-multiselectable")).toBe("true");
  });

  it("renders the rows inside a scroll area's viewport", async () => {
    await drawn(picked());
    await opened();

    expect(slotElement(document.body, "combobox", "rows").parentElement).toBe(
      slotElement(document.body, "combobox", "viewport"),
    );
  });

  it("renders the listbox as the scroll area's viewport", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("listbox")).toBe(slotElement(document.body, "combobox", "viewport"));
  });

  it("sets the machine's direction on the scroll area", async () => {
    await drawn(picked({ dir: "rtl" }));
    await opened();

    expect(slotElement(document.body, "scroll-area", "root").getAttribute("dir")).toBe("rtl");
  });

  it("scrolls the row an arrow key highlights into view in the scroll area's viewport", async () => {
    const reveal = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

    await drawn(picked());
    await typed("ha");
    overflowed(slotElement(document.body, "combobox", "viewport"));
    await keyed("ArrowDown");
    const highlighted = screen.getByRole("combobox").getAttribute("aria-activedescendant");

    expect([reveal.mock.contexts.at(-1), reveal.mock.lastCall]).toStrictEqual([
      document.querySelector(`[id="${String(highlighted)}"]`),
      [{ block: "nearest" }],
    ]);
  });

  it("leaves the document once it closes", async () => {
    await drawn(picked());
    await typed("ha");
    await keyed("Escape");

    expect(screen.queryByRole("listbox", { hidden: true })).toBeNull();
  });

  it("renders the element as names", async () => {
    await drawn(picked({}, { panel: { as: "section" } }));
    await opened();

    expect(slotElement(document.body, "combobox", "content").tagName).toBe("SECTION");
  });
});
