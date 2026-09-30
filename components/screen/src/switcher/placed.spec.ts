import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { inSidebar, inToolbar } from "#switcher/placed.fixtures.tsx";
import { chosen } from "#switcher/switcher.fixtures.tsx";

/**
 * Moves keyboard focus onto the switcher's trigger, which opens a tooltip at once.
 */
async function focused(): Promise<void> {
  fireEvent.keyDown(document, { key: "Tab" });
  fireEvent.focus(screen.getByRole("button", { name: /^Workspace/u }));
  await settled();
}

describe("Placed", () => {
  it("renders the trigger as the toolbar's roving item", () => {
    render(inToolbar());

    expect(screen.getByRole("button", { name: /^Workspace/u }).classList).toContain(
      "roving-focus__item",
    );
  });

  it("renders a toolbar placement outside a toolbar as a plain trigger", () => {
    render(chosen({ placement: "toolbar" }));

    expect(screen.getByRole("button").classList).not.toContain("roving-focus__item");
  });

  it("shows the current name in a tooltip on a rail", async () => {
    await drawn(inSidebar({ iconic: true }));
    await focused();

    expect(screen.getByRole("tooltip").textContent).toBe("Acme");
  });

  it("gives the tooltip and the menu one trigger", async () => {
    await drawn(inSidebar({ iconic: true }));

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders no tooltip in a sidebar in full", async () => {
    await drawn(inSidebar());
    await focused();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("renders no tooltip on a rail without a current choice", async () => {
    await drawn(inSidebar({ iconic: true }, { value: "missing" }));
    await focused();

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
