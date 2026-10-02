import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#data-list/data-list.fixtures.tsx";
import { Item } from "#data-list/item.ts";

describe("Item", () => {
  it("renders a DIV for the item slot", () => {
    const { container } = render(listed(<Item />));

    expect(slotElement(container, "data-list", "item").tagName).toBe("DIV");
  });
});
