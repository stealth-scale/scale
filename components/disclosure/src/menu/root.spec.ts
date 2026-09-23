import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, nested } from "#menu/menu.fixtures.tsx";
import { recipe } from "#menu/recipe.ts";
import { type RootProps } from "#menu/root.tsx";

describe("Root", () => {
  it("hands a submenu the direction the menu above it reads in", async () => {
    const { container } = await drawn(nested({ defaultOpen: true, dir: "rtl" }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.getAttribute("dir"))).toStrictEqual(["rtl", "rtl"]);
  });

  it("leaves a submenu the direction it states for itself", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll<HTMLElement>(".menu__content")];

    expect(panels.map((panel) => panel.getAttribute("dir"))).toStrictEqual([null, null]);
  });

  it("breaks no accessibility rule holding a control and its rows", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultOpen: true })),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("keeps the rows shut until the control is pressed", async () => {
    await drawn(composed());

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens the rows when the control is pressed", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button", { name: /Actions/u }));
    await settled();

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("opens the rows where a caller says it starts open", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("tells a caller which row the reader chose", async () => {
    const told = vi.fn<(details: { readonly value: string }) => void>();

    await drawn(composed({ defaultOpen: true, onSelect: told }));
    await pressed(screen.getByRole("menuitem", { name: "Rename" }));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "rename" }));
  });

  it("tells a caller each time the rows open and shut", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    await drawn(composed({ onOpenChange: told }));
    fireEvent.click(screen.getByRole("button", { name: /Actions/u }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("follows a caller that drives it", async () => {
    await drawn(composed({ open: true }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("takes part in no layout of its own", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "menu", "root").tagName).toBe("DIV");
  });

  it("draws a submenu's control as a row of the menu above it", async () => {
    await drawn(nested({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Share" })).toBeDefined();
  });

  it("opens a submenu when the arrow towards it is pressed", async () => {
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

  it("draws a submenu in the variants the menu above it was given", async () => {
    const { container } = await drawn(nested({ defaultOpen: true, size: "sm" }));
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(panels).toHaveLength(2);
    expect(panels.every((panel) => panel.className.includes("menu__content--sm"))).toBe(true);
  });

  it("draws a submenu in its own variants where it picks them", async () => {
    const { container } = await drawn(nested({ defaultOpen: true, size: "sm" }));
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(panels.every((panel) => !panel.className.includes("menu__content--md"))).toBe(true);
  });
});
