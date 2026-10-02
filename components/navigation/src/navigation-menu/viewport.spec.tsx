import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Viewport } from "#navigation-menu/index.ts";
import {
  elapsed,
  itemed,
  left,
  pointed,
  viewed,
} from "#navigation-menu/navigation-menu.fixtures.tsx";

/**
 * Returns the `aria-expanded` value of the trigger Products.
 *
 * @returns The attribute's value.
 */
function expanded(): null | string {
  return screen.getByRole("button", { name: "Products" }).getAttribute("aria-expanded");
}

describe("Viewport", () => {
  it("renders a div", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "viewport").tagName).toBe("DIV");
  });

  it("sets the id the machine builds from the root's id", async () => {
    const { container } = await drawn(viewed({ id: "site" }));

    expect(slotElement(container, "navigation-menu", "viewport").id).toBe("nav-menu:site:viewport");
  });

  it("hides the viewport while every item is closed", async () => {
    const { container } = await drawn(viewed());

    expect(slotElement(container, "navigation-menu", "viewport").hidden).toBe(true);
  });

  it("shows the viewport while an item is open", async () => {
    const { container } = await drawn(viewed({ defaultValue: "products" }));

    expect(slotElement(container, "navigation-menu", "viewport").hidden).toBe(false);
  });

  it("sets data-align to center outside a positioner", async () => {
    const { container } = await drawn(itemed(<Viewport />));

    expect(slotElement(container, "navigation-menu", "viewport").dataset["align"]).toBe("center");
  });

  it("closes the menu closeDelay after a mouse leaves the viewport", async () => {
    const { container } = await drawn(viewed({ closeDelay: 10, defaultValue: "products" }));
    const viewport = slotElement(container, "navigation-menu", "viewport");

    await pointed(viewport);
    await left(viewport);
    await elapsed(40);

    expect(expanded()).toBe("false");
  });

  it("keeps the menu open after a mouse leaves the viewport with disablePointerLeaveClose", async () => {
    const { container } = await drawn(
      viewed({ closeDelay: 10, defaultValue: "products", disablePointerLeaveClose: true }),
    );
    const viewport = slotElement(container, "navigation-menu", "viewport");

    await pointed(viewport);
    await left(viewport);
    await elapsed(40);

    expect(expanded()).toBe("true");
  });
});
