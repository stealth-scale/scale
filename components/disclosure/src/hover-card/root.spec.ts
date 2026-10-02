import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  accessibilityViolations,
  drawn,
  hovered,
  settled,
  unhovered,
} from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, elapsed, framed } from "#hover-card/hover-card.fixtures.tsx";
import { recipe } from "#hover-card/recipe.ts";
import { type RootProps } from "#hover-card/root.tsx";

/**
 * Returns the panel's line of text, or null while the panel is out of the document.
 */
function card(): HTMLElement | null {
  return screen.queryByText("Wrote the first published program.");
}

/**
 * Returns the trigger.
 */
function link(): HTMLElement {
  return screen.getByRole("link", { name: "Ada Lovelace" });
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
    await drawn(composed());

    expect(card()).toBeNull();
  });

  it("starts open with defaultOpen", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(card()).not.toBeNull();
  });

  it("opens once a pointer rests on the trigger for openDelay", async () => {
    await drawn(composed({ openDelay: 0 }));
    await hovered(link());
    await elapsed();

    expect(card()).not.toBeNull();
  });

  it("stays closed until openDelay runs out", async () => {
    await drawn(composed());
    await hovered(link());
    await elapsed();

    expect(card()).toBeNull();
  });

  it("opens on focus of the trigger", async () => {
    await drawn(composed({ openDelay: 0 }));
    fireEvent.focus(link());
    await elapsed();

    expect(card()).not.toBeNull();
  });

  it("closes on blur of the trigger", async () => {
    await drawn(composed({ openDelay: 0 }));
    fireEvent.focus(link());
    await elapsed();
    fireEvent.blur(link());
    await settled();
    await framed();

    expect(card()).toBeNull();
  });

  it("closes once the pointer leaves for closeDelay", async () => {
    await drawn(composed({ closeDelay: 0, openDelay: 0 }));
    await hovered(link());
    await elapsed();
    await unhovered(link());
    await elapsed();
    await framed();

    expect(card()).toBeNull();
  });

  it("keeps the card open while the pointer moves from the trigger onto the panel", async () => {
    await drawn(composed({ closeDelay: 50, openDelay: 0 }));
    await hovered(link());
    await elapsed();
    await unhovered(link());
    await hovered(screen.getByText("Wrote the first published program."));
    await elapsed(100);

    expect(card()).not.toBeNull();
  });

  it("ignores a touch pointer", async () => {
    await drawn(composed({ openDelay: 0 }));
    fireEvent.pointerOver(link(), { pointerType: "touch" });
    await elapsed();

    expect(card()).toBeNull();
  });

  it("ignores a pointer while disabled", async () => {
    await drawn(composed({ disabled: true, openDelay: 0 }));
    await hovered(link());
    await elapsed();

    expect(card()).toBeNull();
  });

  it("closes on Escape", async () => {
    await drawn(composed({ defaultOpen: true }));
    await framed();
    fireEvent.keyDown(document, { key: "Escape" });
    await settled();
    await framed();

    expect(card()).toBeNull();
  });

  it("keeps a controlled open state once the pointer leaves", async () => {
    await drawn(composed({ closeDelay: 0, open: true }));
    await unhovered(link());
    await elapsed();

    expect(card()).not.toBeNull();
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told, openDelay: 0 }));
    await hovered(link());
    await elapsed();

    expect(told).toHaveBeenLastCalledWith({ open: true });
  });

  it("calls onExitComplete once the panel leaves", async () => {
    const left = vi.fn<() => void>();

    await drawn(composed({ defaultOpen: true, onExitComplete: left }));
    await framed();
    fireEvent.keyDown(document, { key: "Escape" });
    await settled();
    await framed();

    expect(left).toHaveBeenCalledExactlyOnceWith();
  });

  it("renders a span", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "hover-card", "root").tagName).toBe("SPAN");
  });
});
