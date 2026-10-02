import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#toggle-tip/recipe.ts";
import { type RootProps } from "#toggle-tip/root.tsx";
import { composed, framed, note } from "#toggle-tip/toggle-tip.fixtures.tsx";

/**
 * Returns the trigger.
 */
function trigger(): HTMLElement {
  return screen.getByRole("button", { name: "About the settlement date" });
}

describe("Root", () => {
  it("returns no accessibility violation while closed", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation while open", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultOpen: true })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("starts closed", async () => {
    const { container } = await drawn(composed());

    expect(note(container)).toBeNull();
  });

  it("opens on a press of the trigger", async () => {
    const { container } = await drawn(composed());

    await pressed(trigger());

    expect(note(container)).not.toBeNull();
  });

  it("starts open with defaultOpen", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(note(container)).not.toBeNull();
  });

  it("keeps focus on the trigger as the note opens", async () => {
    await drawn(composed());
    trigger().focus();
    await pressed(trigger());
    await framed();

    expect(document.activeElement).toBe(trigger());
  });

  it("moves focus into the note with autoFocus", async () => {
    const { container } = await drawn(composed({ autoFocus: true }));

    await pressed(trigger());
    await framed();

    expect(document.activeElement).toBe(note(container));
  });

  it("closes on Escape", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    await framed();
    fireEvent.keyDown(trigger(), { key: "Escape" });
    await settled();
    await framed();

    expect(note(container)).toBeNull();
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told }));
    await pressed(trigger());

    expect(told).toHaveBeenLastCalledWith({ open: true });
  });

  it("renders a span", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "toggle-tip", "root").tagName).toBe("SPAN");
  });
});
