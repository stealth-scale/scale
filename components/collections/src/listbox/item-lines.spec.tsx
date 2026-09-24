import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemLines } from "#listbox/item-lines.ts";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemLines", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ItemLines>Fathom</ItemLines>));

    expect(slotElement(container, "listbox", "itemLines").tagName).toBe("SPAN");
  });

  it("conforms as a span element", () => {
    expect(
      violations(ItemLines, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "listbox", "itemLines"),
        wrapper: offered,
      }),
    ).toStrictEqual([]);
  });

  it("renders its children", () => {
    const { container } = render(offered(<ItemLines>Fathom</ItemLines>));

    expect(slotElement(container, "listbox", "itemLines").textContent).toBe("Fathom");
  });

  it("sets no role", () => {
    const { container } = render(offered(<ItemLines>Fathom</ItemLines>));

    expect(slotElement(container, "listbox", "itemLines").getAttribute("role")).toBeNull();
  });

  it("sets no aria-label", () => {
    const { container } = render(offered(<ItemLines>Fathom</ItemLines>));

    expect(slotElement(container, "listbox", "itemLines").getAttribute("aria-label")).toBeNull();
  });
});
