import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed } from "#tree-view/tree-view.fixtures.tsx";

/**
 * Returns the checkbox in the row named by the text given.
 *
 * @param name - The row's text.
 * @returns The checkbox.
 */
function box(name: string): HTMLElement {
  return within(screen.getByRole("treeitem", { name })).getByText("✓");
}

describe("NodeCheckbox", () => {
  it("hides the box from assistive technology", async () => {
    await drawn(composed({ checkable: true }));

    expect(box("readme.md").getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves the machine's checkbox role out", async () => {
    await drawn(composed({ checkable: true }));

    expect(box("readme.md").hasAttribute("role")).toBe(false);
  });

  it("toggles the check on a press", async () => {
    await drawn(composed({ checkable: true }));
    await pressed(box("readme.md"));

    expect(screen.getByRole("treeitem", { name: "readme.md" }).getAttribute("aria-checked")).toBe(
      "true",
    );
  });

  it("sets data-state to indeterminate on a partly checked branch", async () => {
    await drawn(composed({ checkable: true, defaultCheckedValue: ["app.ts"] }));

    expect(box("src").dataset["state"]).toBe("indeterminate");
  });
});
