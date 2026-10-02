import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item, List, Root } from "#navigation-menu/index.ts";
import {
  composed,
  elapsed,
  framed,
  left,
  pointed,
} from "#navigation-menu/navigation-menu.fixtures.tsx";
import { Trigger } from "#navigation-menu/trigger.tsx";

/**
 * Returns the `aria-expanded` value of the trigger of that name.
 *
 * @param name - The trigger's name.
 * @returns The attribute's value.
 */
function expanded(name: string): null | string {
  return screen.getByRole("button", { name }).getAttribute("aria-expanded");
}

describe("Trigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "trigger").tagName).toBe("BUTTON");
  });

  it("sets type to button", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Products" }).getAttribute("type")).toBe("button");
  });

  it("sets aria-controls to the id of its item's panel", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("button", { name: "Products" }).getAttribute("aria-controls")).toBe(
      slotElement(container, "navigation-menu", "content").id,
    );
  });

  it("opens its panel on a press", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("button", { name: "Products" }));
    await settled();

    expect(expanded("Products")).toBe("true");
  });

  it("closes its panel on a second press", async () => {
    await drawn(composed({ defaultValue: "products" }));
    fireEvent.click(screen.getByRole("button", { name: "Products" }));
    await settled();

    expect(expanded("Products")).toBe("false");
  });

  it("opens its panel openDelay after a mouse arrives", async () => {
    await drawn(composed({ openDelay: 10 }));
    await pointed(screen.getByRole("button", { name: "Products" }));
    await elapsed(40);

    expect(expanded("Products")).toBe("true");
  });

  it("keeps its panel closed until openDelay runs out", async () => {
    await drawn(composed({ openDelay: 200 }));
    await pointed(screen.getByRole("button", { name: "Products" }));

    expect(expanded("Products")).toBe("false");
  });

  it("ignores a touch pointer that arrives", async () => {
    await drawn(composed({ openDelay: 0 }));
    await pointed(screen.getByRole("button", { name: "Products" }), "touch");
    await elapsed();

    expect(expanded("Products")).toBe("false");
  });

  it("ignores a mouse with disableHoverTrigger", async () => {
    await drawn(composed({ disableHoverTrigger: true, openDelay: 0 }));
    await pointed(screen.getByRole("button", { name: "Products" }));
    await elapsed();

    expect(expanded("Products")).toBe("false");
  });

  it("ignores a press with disableClickTrigger", async () => {
    await drawn(composed({ disableClickTrigger: true }));
    fireEvent.click(screen.getByRole("button", { name: "Products" }));
    await settled();

    expect(expanded("Products")).toBe("false");
  });

  it("closes its panel closeDelay after a mouse leaves", async () => {
    await drawn(composed({ closeDelay: 10, openDelay: 0 }));
    await pointed(screen.getByRole("button", { name: "Products" }));
    await elapsed();
    await left(screen.getByRole("button", { name: "Products" }));
    await elapsed(40);

    expect(expanded("Products")).toBe("false");
  });

  it("moves focus to the next trigger on ArrowRight", async () => {
    await drawn(composed());
    screen.getByRole("button", { name: "Products" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Products" }), { key: "ArrowRight" });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Company" }));
  });

  it("moves focus to the bar's last link on End", async () => {
    await drawn(composed());
    screen.getByRole("button", { name: "Products" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Products" }), { key: "End" });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Pricing" }));
  });

  it("moves focus into its open panel on ArrowDown", async () => {
    await drawn(composed({ defaultValue: "products" }));
    screen.getByRole("button", { name: "Products" }).focus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Products" }), { key: "ArrowDown" });
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("link", { name: "Ledger" }));
  });

  it("calls a caller's onClick beside the machine's handler", async () => {
    const heard = vi.fn<() => void>();

    await drawn(
      <Root aria-label="Site">
        <List>
          <Item value="products">
            <Trigger onClick={heard}>Products</Trigger>
          </Item>
        </List>
      </Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Products" }));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
    expect(expanded("Products")).toBe("true");
  });
});
