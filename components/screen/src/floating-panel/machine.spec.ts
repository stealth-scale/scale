import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed, keyed, panel, placed } from "#floating-panel/floating-panel.fixtures.tsx";
import { splitFloatingPanelProps } from "#floating-panel/machine.ts";

/**
 * Returns whether the trigger reports the panel open.
 */
function expanded(): null | string {
  return screen.getByRole("button", { name: "Notes" }).getAttribute("aria-expanded");
}

describe("useFloatingPanelMachine", () => {
  it("closes the panel on Escape", async () => {
    await drawn(composed({ defaultOpen: true }));
    await keyed(panel(), { key: "Escape" });

    expect(expanded()).toBe("false");
  });

  it("keeps the panel open on Escape when closeOnEscape is false", async () => {
    await drawn(composed({ closeOnEscape: false, defaultOpen: true }));
    await keyed(panel(), { key: "Escape" });

    expect(expanded()).toBe("true");
  });

  it("keeps the panel at least 240 pixels wide when minSize is absent", async () => {
    await drawn(composed({ defaultOpen: true, defaultSize: { height: 200, width: 245 } }));
    await keyed(panel(), { altKey: true, key: "ArrowLeft", shiftKey: true });

    expect(placed().width).toBe(240);
  });

  it("keeps the panel at least 100 pixels tall when minSize is absent", async () => {
    await drawn(composed({ defaultOpen: true, defaultSize: { height: 105, width: 300 } }));
    await keyed(panel(), { altKey: true, key: "ArrowUp", shiftKey: true });

    expect(placed().height).toBe(100);
  });

  it("keeps the panel at the caller's minSize", async () => {
    await drawn(
      composed({
        defaultOpen: true,
        defaultSize: { height: 105, width: 105 },
        minSize: { height: 50, width: 100 },
      }),
    );
    await keyed(panel(), { altKey: true, key: "ArrowLeft", shiftKey: true });

    expect(placed().width).toBe(100);
  });

  it("keeps a controlled panel open on a press of the close trigger", async () => {
    await drawn(composed({ open: true }));
    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(panel().dataset["state"]).toBe("open");
  });

  it("calls onOpenChange with false on a press of a controlled panel's close trigger", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told, open: true }));
    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(told).toHaveBeenLastCalledWith({ open: false });
  });

  it("derives the panel's id from the caller's id", async () => {
    await drawn(composed({ defaultOpen: true, id: "notes" }));

    expect(panel().id).toBe("float:notes:content");
  });

  it("splits the machine's settings from the element's props", () => {
    expect(splitFloatingPanelProps({ className: "wide", gridSize: 8 })).toStrictEqual([
      { gridSize: 8 },
      { className: "wide" },
    ]);
  });
});
