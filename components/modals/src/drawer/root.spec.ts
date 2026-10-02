import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, panelled } from "#drawer/drawer.fixtures.tsx";
import { recipe } from "#drawer/recipe.ts";
import { type RootProps } from "#drawer/root.tsx";

/**
 * Waits for the next animation frame, in which the presence reads the closed panel's animation.
 */
async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

describe("Root", () => {
  it("returns no accessibility violation while closed", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for the open panel", async () => {
    await expect(accessibilityViolations(panelled, { frame: true })).resolves.toStrictEqual([]);
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

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens on a press of the trigger", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Filters" }));

    expect(told).toHaveBeenLastCalledWith({ open: true });
  });

  it("closes on Escape", async () => {
    await drawn(composed({ defaultOpen: true }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await settled();
    await frame();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onExitComplete once the panel leaves", async () => {
    const left = vi.fn<() => void>();

    await drawn(composed({ defaultOpen: true, onExitComplete: left }));
    await pressed(screen.getByRole("button", { name: "Close" }));
    await frame();

    expect(left).toHaveBeenCalledTimes(1);
  });

  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "drawer", "root").tagName).toBe("DIV");
  });
});
