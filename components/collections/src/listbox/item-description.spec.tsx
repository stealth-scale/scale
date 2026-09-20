import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemDescription } from "#listbox/item-description.ts";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemDescription", () => {
  it("draws a span inside the root it needs above it", () => {
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

  it("takes the size the root states", () => {
    const { container } = render(
      offered(<ItemDescription>Settles nightly</ItemDescription>, { size: "lg" }),
    );

    expect(slotElement(container, "listbox", "itemDescription").className).toContain("lg");
  });

  it("names nothing of its own, because the row's words name the row", () => {
    const { container } = render(offered(<ItemDescription>Settles nightly</ItemDescription>));
    const drawn = slotElement(container, "listbox", "itemDescription");

    expect(drawn.getAttribute("role")).toBeNull();
    expect(drawn.getAttribute("aria-label")).toBeNull();
  });
});
