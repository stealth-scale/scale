import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#menu/item.tsx";
import { composed, kept, listed } from "#menu/menu.fixtures.tsx";

describe("Item", () => {
  it("renders a div", async () => {
    const { container } = await drawn(listed(<Item value="rename">Rename</Item>));

    expect(slotElement(container, "menu", "item").tagName).toBe("DIV");
  });

  it("sets role menuitem", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Rename" })).toBeDefined();
  });

  it("sets data-value to its value", async () => {
    const { container } = await drawn(listed(<Item value="rename">Rename</Item>));

    expect(slotElement(container, "menu", "item").dataset["value"]).toBe("rename");
  });

  it("sets aria-disabled when disabled", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Archive" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("calls no onSelect for a disabled row", async () => {
    const told = vi.fn<(details: { readonly value: string }) => void>();

    await drawn(composed({ defaultOpen: true, onSelect: told }));
    await pressed(screen.getByRole("menuitem", { name: "Archive" }));

    expect(told).not.toHaveBeenCalled();
  });

  it("sets data-tone to its tone", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Delete" }).dataset["tone"]).toBe("critical");
  });

  it("sets no data-tone without a tone", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Rename" }).dataset["tone"]).toBeUndefined();
  });

  it("sets data-highlighted on pointer down", async () => {
    await drawn(composed({ defaultOpen: true }));

    const row = screen.getByRole("menuitem", { name: "Rename" });

    fireEvent.pointerDown(row);
    await settled();

    expect(screen.getByRole("menuitem", { name: "Rename" }).dataset["highlighted"]).toBe("");
  });

  it("sets data-valuetext to its valueText", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename" valueText="Change the name">
          Rename
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "item").dataset["valuetext"]).toBe("Change the name");
  });

  it("closes the menu on select", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("menuitem", { name: "Rename" }));

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("keeps the menu open with closeOnSelect false", async () => {
    await drawn(kept({ defaultOpen: true }));
    await pressed(screen.getByRole("menuitem", { name: "Bold" }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      listed(
        <Item as="a" value="rename">
          Rename
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "item").tagName).toBe("A");
  });
});
