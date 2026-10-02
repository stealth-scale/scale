import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { splitNavigationMenuProps, type ValueChangeDetails } from "#navigation-menu/machine.ts";
import { composed, framed } from "#navigation-menu/navigation-menu.fixtures.tsx";

/**
 * Returns the `aria-expanded` value of the trigger Products.
 *
 * @returns The attribute's value.
 */
function expanded(): null | string {
  return screen.getByRole("button", { name: "Products" }).getAttribute("aria-expanded");
}

describe("machine", () => {
  it("builds the root's id from the id it takes", async () => {
    const { container } = await drawn(composed({ id: "site" }));

    expect(slotElement(container, "navigation-menu", "root").id).toBe("nav-menu:site");
  });

  it("builds the root's id from a generated id without one", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "root").id).toMatch(/^nav-menu:.+/u);
  });

  it("closes an item open at mount on Escape", async () => {
    await drawn(composed({ defaultValue: "products" }));
    await framed();
    fireEvent.keyDown(document.body, { key: "Escape" });
    await settled();

    expect(expanded()).toBe("false");
  });

  it("never calls onValueChange with the value the menu mounts with", async () => {
    const changed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(composed({ defaultValue: "products", onValueChange: changed }));
    await framed();

    expect(changed).not.toHaveBeenCalled();
  });

  it("opens the item of a controlled value the caller changes", async () => {
    const { rerender } = await drawn(composed({ value: "" }));

    rerender(composed({ value: "products" }));
    await settled();

    expect(expanded()).toBe("true");
  });

  it("splits the machine's options from the element's props", () => {
    expect(splitNavigationMenuProps({ "aria-label": "Site", openDelay: 10 })).toStrictEqual([
      { openDelay: 10 },
      { "aria-label": "Site" },
    ]);
  });

  it("drops translations from the machine's options", () => {
    const props = { openDelay: 10, translations: { rootLabel: "Site" } };

    expect(splitNavigationMenuProps(props)[0]).toStrictEqual({ openDelay: 10 });
  });
});
