import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

/**
 * Returns the indicator in the row named by the text given.
 *
 * @param name - The row's text.
 * @returns The indicator.
 */
function indicator(name: string): Element | null {
  return screen
    .getByRole("treeitem", { name })
    .querySelector(`.${slotClass("tree-view", "itemIndicator")}`);
}

describe("ItemIndicator", () => {
  it("shows the mark of a selected item", async () => {
    await drawn(composed({ defaultSelectedValue: ["readme.md"] }));

    expect(indicator("readme.md")?.hasAttribute("hidden")).toBe(false);
  });

  it("hides the mark of an item that is not selected", async () => {
    await drawn(composed());

    expect(indicator("readme.md")?.hasAttribute("hidden")).toBe(true);
  });

  it("hides the mark from assistive technology", async () => {
    await drawn(composed({ defaultSelectedValue: ["readme.md"] }));

    expect(indicator("readme.md")?.getAttribute("aria-hidden")).toBe("true");
  });
});
