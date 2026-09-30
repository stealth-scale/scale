import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  composed,
  elapsed,
  framed,
  left,
  pointed,
  viewed,
} from "#navigation-menu/navigation-menu.fixtures.tsx";

/**
 * Returns the `aria-expanded` value of the trigger of that name.
 *
 * @param name - The trigger's name.
 * @returns The attribute's value.
 */
function expanded(name: string): null | string {
  return screen.getByRole("button", { name }).getAttribute("aria-expanded");
}

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultValue: "products" }));

    expect(slotElement(container, "navigation-menu", "content").tagName).toBe("DIV");
  });

  it("hides the panel of a closed item", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "content").hidden).toBe(true);
  });

  it("shows the panel of an open item", async () => {
    const { container } = await drawn(composed({ defaultValue: "products" }));

    expect(slotElement(container, "navigation-menu", "content").hidden).toBe(false);
  });

  it("sets aria-labelledby to its trigger's id", async () => {
    const { container } = await drawn(composed({ defaultValue: "products" }));

    expect(
      slotElement(container, "navigation-menu", "content").getAttribute("aria-labelledby"),
    ).toBe(screen.getByRole("button", { name: "Products" }).id);
  });

  it("renders the panel inside its item without a viewport", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "content").parentElement).toBe(
      slotElement(container, "navigation-menu", "item"),
    );
  });

  it("renders the panel inside the viewport while the menu renders one", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "content").parentElement).toBe(
      slotElement(container, "navigation-menu", "viewport"),
    );
  });

  it("renders the machine's trigger proxy in its item while the menu renders a viewport", async () => {
    const { container } = await drawn(viewed());

    expect(
      slotElement(container, "navigation-menu", "item").querySelector("[data-trigger-proxy]"),
    ).not.toBeNull();
  });

  it("points the viewport proxy's aria-owns at the open panel", async () => {
    const { container } = await drawn(viewed({ defaultValue: "products" }));

    expect(
      slotElement(container, "navigation-menu", "item")
        .querySelector("[aria-owns]")
        ?.getAttribute("aria-owns"),
    ).toBe(slotElement(container, "navigation-menu", "content").id);
  });

  it("closes the menu closeDelay after a mouse leaves the panel", async () => {
    const { container } = await drawn(composed({ closeDelay: 10, defaultValue: "products" }));
    const panel = slotElement(container, "navigation-menu", "content");

    await pointed(panel);
    await left(panel);
    await elapsed(40);

    expect(expanded("Products")).toBe("false");
  });

  it("keeps the menu open after a mouse leaves the panel with disablePointerLeaveClose", async () => {
    const { container } = await drawn(
      composed({ closeDelay: 10, defaultValue: "products", disablePointerLeaveClose: true }),
    );
    const panel = slotElement(container, "navigation-menu", "content");

    await pointed(panel);
    await left(panel);
    await elapsed(40);

    expect(expanded("Products")).toBe("true");
  });

  it("closes the menu on Escape", async () => {
    await drawn(composed({ defaultValue: "products" }));
    await framed();
    fireEvent.keyDown(screen.getByRole("link", { name: "Ledger" }), { key: "Escape" });
    await settled();

    expect(expanded("Products")).toBe("false");
  });

  it("returns focus to its trigger on Escape", async () => {
    await drawn(composed({ defaultValue: "products" }));
    await framed();
    screen.getByRole("link", { name: "Ledger" }).focus();
    fireEvent.keyDown(screen.getByRole("link", { name: "Ledger" }), { key: "Escape" });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Products" }));
  });

  it("closes the menu on a press outside", async () => {
    await drawn(composed({ defaultValue: "products" }));
    await elapsed();
    fireEvent.pointerDown(document.body);
    await framed();

    expect(expanded("Products")).toBe("false");
  });
});
