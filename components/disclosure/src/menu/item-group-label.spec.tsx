import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemGroupLabel } from "#menu/item-group-label.tsx";
import { grouped, listed } from "#menu/menu.fixtures.tsx";

describe("ItemGroupLabel", () => {
  it("renders a div", async () => {
    const { container } = await drawn(
      listed(<ItemGroupLabel value="density">Density</ItemGroupLabel>),
    );

    expect(slotElement(container, "menu", "itemGroupLabel").tagName).toBe("DIV");
  });

  it("takes an id", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(slotElement(container, "menu", "itemGroupLabel").id).toBeTruthy();
  });

  it("sets no role", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(slotElement(container, "menu", "itemGroupLabel").hasAttribute("role")).toBe(false);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      listed(
        <ItemGroupLabel as="h3" value="density">
          Density
        </ItemGroupLabel>,
      ),
    );

    expect(slotElement(container, "menu", "itemGroupLabel").tagName).toBe("H3");
  });
});
