import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemLines } from "#listbox/item-lines.ts";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemLines", () => {
  it("draws a span inside the root it needs above it", () => {
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

  it("holds what it is given", () => {
    const { container } = render(offered(<ItemLines>Fathom</ItemLines>));

    expect(slotElement(container, "listbox", "itemLines").textContent).toBe("Fathom");
  });

  it("names nothing of its own, because the row's words name the row", () => {
    const { container } = render(offered(<ItemLines>Fathom</ItemLines>));
    const drawn = slotElement(container, "listbox", "itemLines");

    expect(drawn.getAttribute("role")).toBeNull();
    expect(drawn.getAttribute("aria-label")).toBeNull();
  });
});
