import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, nested } from "#menu/menu.fixtures.tsx";
import { recipe } from "#menu/recipe.ts";
import { type RootProps } from "#menu/root.tsx";

describe("Root", () => {
  it("passes the parent's direction to a submenu", async () => {
    const { container } = await drawn(nested({ defaultOpen: true, dir: "rtl" }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.getAttribute("dir"))).toStrictEqual(["rtl", "rtl"]);
  });

  it("sets no direction when no menu in the nest sets one", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.getAttribute("dir"))).toStrictEqual([null, null]);
  });

  it("passes axe with a trigger and its rows", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultOpen: true })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders no menu until the trigger is pressed", async () => {
    await drawn(composed());

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens the menu when the trigger is pressed", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button", { name: /Actions/u }));
    await settled();

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("opens the menu with defaultOpen", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("calls onSelect with the chosen row's value", async () => {
    const told = vi.fn<(details: { readonly value: string }) => void>();

    await drawn(composed({ defaultOpen: true, onSelect: told }));
    await pressed(screen.getByRole("menuitem", { name: "Rename" }));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "rename" }));
  });

  it("calls onOpenChange when the menu opens", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told }));
    fireEvent.click(screen.getByRole("button", { name: /Actions/u }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("opens the menu with a controlled open", async () => {
    await drawn(composed({ open: true }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "menu", "root").tagName).toBe("DIV");
  });

  it("renders a submenu's trigger as a row of its parent", async () => {
    await drawn(nested({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Share" })).toBeDefined();
  });

  it("opens a submenu on ArrowRight", async () => {
    await drawn(nested({ defaultOpen: true }));

    const panel = screen.getByRole("menu");

    fireEvent.keyDown(panel, { key: "ArrowDown" });
    await settled();
    fireEvent.keyDown(panel, { key: "ArrowDown" });
    await settled();
    fireEvent.keyDown(panel, { key: "ArrowRight" });
    await settled();

    expect(screen.getByRole("menuitem", { name: "Email" })).toBeDefined();
  });

  it("passes the parent's variants to a submenu", async () => {
    const { container } = await drawn(nested({ defaultOpen: true, size: "sm" }));
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(panels).toHaveLength(2);
    expect(panels.every((panel) => panel.className.includes("menu__content--sm"))).toBe(true);
  });

  it("applies no default size to a submenu of a small menu", async () => {
    const { container } = await drawn(nested({ defaultOpen: true, size: "sm" }));
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(panels.every((panel) => !panel.className.includes("menu__content--md"))).toBe(true);
  });
});
