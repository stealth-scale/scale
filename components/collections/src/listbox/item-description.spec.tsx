import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemDescription } from "#listbox/item-description.ts";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemDescription", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ItemDescription>Settles nightly</ItemDescription>));

    expect(slotElement(container, "listbox", "itemDescription").tagName).toBe("SPAN");
  });

  it("conforms as a span element", () => {
    expect(
      violations(ItemDescription, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "listbox", "itemDescription"),
        wrapper: offered,
      }),
    ).toStrictEqual([]);
  });

  it("applies the root's size class", () => {
    const { container } = render(
      offered(<ItemDescription>Settles nightly</ItemDescription>, { size: "lg" }),
    );

    expect(slotElement(container, "listbox", "itemDescription").className).toContain("lg");
  });

  it("sets no role", () => {
    const { container } = render(offered(<ItemDescription>Settles nightly</ItemDescription>));

    expect(slotElement(container, "listbox", "itemDescription").getAttribute("role")).toBeNull();
  });

  it("sets no aria-label", () => {
    const { container } = render(offered(<ItemDescription>Settles nightly</ItemDescription>));

    expect(
      slotElement(container, "listbox", "itemDescription").getAttribute("aria-label"),
    ).toBeNull();
  });
});
