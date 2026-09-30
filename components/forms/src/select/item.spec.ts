import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { framed, opened, picked, trigger } from "#select/select.fixtures.tsx";

/**
 * Returns the row named by its account's name.
 */
function row(name: string): HTMLElement {
  return screen.getByRole("option", { name });
}

describe("Item", () => {
  it("renders a div with role option", async () => {
    await drawn(picked());
    await opened();

    expect(row("Bridge Ledger").tagName).toBe("DIV");
  });

  it("sets aria-selected on the selected row", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await opened();

    expect(row("Halden & Co").getAttribute("aria-selected")).toBe("true");
  });

  it("sets data-highlighted on the row the highlight is on", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await opened();

    expect(row("Halden & Co").dataset["highlighted"]).toBe("");
  });

  it("selects the row on a press", async () => {
    await drawn(picked());
    await opened();
    await pressed(row("Perrin Freight"));
    await settled();

    expect(trigger().textContent).toBe("Perrin Freight");
  });

  it("closes the panel on a press", async () => {
    await drawn(picked());
    await opened();
    await pressed(row("Perrin Freight"));
    await settled();
    await framed();

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the panel open on a press with several choices", async () => {
    await drawn(picked({ multiple: true }));
    await opened();
    await pressed(row("Bridge Ledger"));
    await settled();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("toggles the row on a second press with several choices", async () => {
    await drawn(picked({ defaultValue: ["bridge"], multiple: true }));
    await opened();
    await pressed(row("Bridge Ledger"));
    await settled();

    expect(row("Bridge Ledger").getAttribute("aria-selected")).toBe("false");
  });

  it("sets aria-disabled on a disabled row", async () => {
    await drawn(picked());
    await opened();

    expect(row("Voss Holdings").getAttribute("aria-disabled")).toBe("true");
  });

  it("selects nothing on a press of a disabled row", async () => {
    await drawn(picked());
    await opened();
    fireEvent.click(row("Voss Holdings"));
    await settled();

    expect(trigger().textContent).toBe("Pick an account");
  });
});
