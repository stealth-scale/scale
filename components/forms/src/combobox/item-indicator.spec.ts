import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picked } from "#combobox/combobox.fixtures.tsx";

/**
 * Returns the check of the row named by its account's name.
 */
function check(name: string): HTMLElement {
  return slotElement(screen.getByRole("option", { name }), "combobox", "itemIndicator");
}

describe("ItemIndicator", () => {
  it("renders the check of an unselected row without hidden", async () => {
    await drawn(picked());
    await opened();

    expect(check("Bridge Ledger").hasAttribute("hidden")).toBe(false);
  });

  it("hides the check from assistive technology", async () => {
    await drawn(picked());
    await opened();

    expect(check("Bridge Ledger").getAttribute("aria-hidden")).toBe("true");
  });

  it("sets data-state to unchecked on an unselected row", async () => {
    await drawn(picked());
    await opened();

    expect(check("Bridge Ledger").dataset["state"]).toBe("unchecked");
  });

  it("sets data-state to checked on the selected row", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();

    expect(check("Bridge Ledger").dataset["state"]).toBe("checked");
  });
});
