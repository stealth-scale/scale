import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item, List, Root, Trigger } from "#navigation-menu/index.ts";
import { composed } from "#navigation-menu/navigation-menu.fixtures.tsx";

/**
 * Renders a bar with one disabled item.
 *
 * @returns The navigation menu.
 */
function disabled(): ReactElement {
  return (
    <Root aria-label="Site">
      <List>
        <Item disabled value="archive">
          <Trigger>Archive</Trigger>
        </Item>
      </List>
    </Root>
  );
}

describe("Item", () => {
  it("renders an li", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "item").tagName).toBe("LI");
  });

  it("sets data-value to its value", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "item").dataset["value"]).toBe("products");
  });

  it("sets data-state to open while it is open", async () => {
    const { container } = await drawn(composed({ defaultValue: "products" }));

    expect(slotElement(container, "navigation-menu", "item").dataset["state"]).toBe("open");
  });

  it("sets data-state to closed while it is closed", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "navigation-menu", "item").dataset["state"]).toBe("closed");
  });

  it("sets data-disabled on a disabled item", async () => {
    const { container } = await drawn(disabled());

    expect(slotElement(container, "navigation-menu", "item").dataset["disabled"]).toBe("");
  });

  it("disables the trigger of a disabled item", async () => {
    await drawn(disabled());

    expect(screen.getByRole("button", { name: "Archive" })).toHaveProperty("disabled", true);
  });
});
