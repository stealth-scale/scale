import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#popover/popover.fixtures.tsx";
import { recipe } from "#popover/recipe.ts";
import { type RootProps } from "#popover/root.tsx";

describe("Root", () => {
  it("returns no accessibility violation", async () => {
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

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens on a press of the trigger", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button", { name: /Filters/u }));
    await settled();

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("starts open with defaultOpen", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("calls onOpenChange with the new state", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told }));
    fireEvent.click(screen.getByRole("button", { name: /Filters/u }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("keeps a controlled open state on a press", async () => {
    await drawn(composed({ open: true }));
    fireEvent.click(screen.getByRole("button", { name: /Filters/u }));
    await settled();

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "popover", "root").tagName).toBe("DIV");
  });
});
