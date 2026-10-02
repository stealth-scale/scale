import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemCheckbox } from "#listbox/item-checkbox.ts";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemCheckbox", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ItemCheckbox />));

    expect(slotElement(container, "listbox", "itemCheckbox").tagName).toBe("SPAN");
  });

  it("conforms as a span element", () => {
    expect(
      violations(ItemCheckbox, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "listbox", "itemCheckbox"),
        wrapper: offered,
      }),
    ).toStrictEqual([]);
  });

  it("hides the checkbox from assistive technology", () => {
    const { container } = render(offered(<ItemCheckbox />));

    expect(slotElement(container, "listbox", "itemCheckbox").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("applies the root's size class", () => {
    const { container } = render(offered(<ItemCheckbox />, { size: "lg" }));

    expect(slotElement(container, "listbox", "itemCheckbox").className).toContain("lg");
  });
});
