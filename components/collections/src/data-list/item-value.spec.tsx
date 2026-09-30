import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#data-list/data-list.fixtures.tsx";
import { ItemValue } from "#data-list/item-value.ts";
import { Item } from "#data-list/item.ts";

describe("ItemValue", () => {
  it("renders a DD for the item value slot", () => {
    const { container } = render(
      listed(
        <Item>
          <ItemValue>4 September</ItemValue>
        </Item>,
      ),
    );

    expect(slotElement(container, "data-list", "itemValue").tagName).toBe("DD");
  });
});
