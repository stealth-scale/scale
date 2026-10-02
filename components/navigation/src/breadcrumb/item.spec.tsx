import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Item } from "#breadcrumb/item.ts";

describe("Item", () => {
  it("conforms as a list item inside the root", () => {
    expect(
      violations(Item, {
        as: true,
        children: true,
        element: "LI",
        subject: (container) => slotElement(container, "breadcrumb", "item"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("renders the element passed as as", () => {
    const { container } = render(trailed(<Item as="span">Invoices</Item>));

    expect(slotElement(container, "breadcrumb", "item").tagName).toBe("SPAN");
  });
});
