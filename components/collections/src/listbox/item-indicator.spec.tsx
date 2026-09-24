import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ItemIndicator } from "#listbox/item-indicator.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";
import { ROWS } from "#listbox/rows.fixtures.ts";

describe("ItemIndicator", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ItemIndicator item={ROWS[0]}>t</ItemIndicator>));

    expect(slotElement(container, "listbox", "itemIndicator").tagName).toBe("SPAN");
  });

  it("hides the mark from assistive technology", () => {
    const { container } = render(offered(<ItemIndicator item={ROWS[0]}>t</ItemIndicator>));

    expect(slotElement(container, "listbox", "itemIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
