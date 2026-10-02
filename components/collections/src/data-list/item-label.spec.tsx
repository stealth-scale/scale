import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#data-list/data-list.fixtures.tsx";
import { ItemLabel } from "#data-list/item-label.ts";
import { Item } from "#data-list/item.ts";

describe("ItemLabel", () => {
  it("renders a DT for the item label slot", () => {
    const { container } = render(
      listed(
        <Item>
          <ItemLabel>Raised</ItemLabel>
        </Item>,
      ),
    );

    expect(slotElement(container, "data-list", "itemLabel").tagName).toBe("DT");
  });
});
