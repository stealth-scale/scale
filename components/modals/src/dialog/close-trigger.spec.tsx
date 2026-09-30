import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { CloseTrigger } from "#dialog/close-trigger.tsx";
import { opened } from "#dialog/dialog.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(opened(<CloseTrigger aria-label="Close" />));

    expect(slotElement(container, "dialog", "closeTrigger").tagName).toBe("BUTTON");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<CloseTrigger aria-label="Close" />));

    expect(slotElement(container, "dialog", "closeTrigger").className).toContain(
      slotClass("dialog", "closeTrigger"),
    );
  });

  it("takes its name from aria-label", async () => {
    await drawn(opened(<CloseTrigger aria-label="Close the dialog" />));

    expect(screen.getByRole("button", { name: "Close the dialog" })).toBeDefined();
  });

  it("closes the dialog on a press", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(opened(<CloseTrigger aria-label="Close" />, { onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(told).toHaveBeenLastCalledWith({ open: false });
  });

  it("sets the id the machine derives from the root's id", async () => {
    const { container } = await drawn(
      opened(<CloseTrigger aria-label="Close" />, { id: "rename" }),
    );

    expect(slotElement(container, "dialog", "closeTrigger").id).toBe("dialog:rename:close");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<CloseTrigger aria-label="Close" as="a" />));

    expect(slotElement(container, "dialog", "closeTrigger").tagName).toBe("A");
  });
});
