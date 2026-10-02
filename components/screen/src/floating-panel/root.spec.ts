import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, frame } from "#floating-panel/floating-panel.fixtures.tsx";
import { recipe } from "#floating-panel/recipe.ts";
import { type RootProps } from "#floating-panel/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation while closed", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for the open panel", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultOpen: true }), { frame: true }),
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

  it("renders a div with the root class", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "floating-panel", "root").tagName).toBe("DIV");
  });

  it("renders no panel until it first opens", async () => {
    await drawn(composed());

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("renders the closed panel hidden at mount when lazyMount is false", async () => {
    await drawn(composed({ lazyMount: false }));

    expect(screen.getByRole("dialog", { hidden: true }).hidden).toBe(true);
  });

  it("opens on a press of the trigger", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Notes" }));

    expect(screen.getByRole("dialog", { name: "Launch notes" })).toBeDefined();
  });

  it("starts open with defaultOpen", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told }));
    await pressed(screen.getByRole("button", { name: "Notes" }));

    expect(told).toHaveBeenLastCalledWith({ open: true });
  });

  it("removes the panel once it closes", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("button", { name: "Close" }));
    await frame();

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("keeps the closed panel hidden when unmountOnExit is false", async () => {
    await drawn(composed({ defaultOpen: true, unmountOnExit: false }));
    await pressed(screen.getByRole("button", { name: "Close" }));
    await frame();

    expect(screen.getByRole("dialog", { hidden: true }).hidden).toBe(true);
  });
});
