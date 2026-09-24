import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ItemGroupLabel } from "#listbox/item-group-label.tsx";
import { ItemGroup } from "#listbox/item-group.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemGroup", () => {
  it("renders a div", () => {
    const { container } = render(offered(<ItemGroup id="recent" />));

    expect(slotElement(container, "listbox", "itemGroup").tagName).toBe("DIV");
  });

  it("renders the element with the group role", () => {
    render(offered(<ItemGroup id="recent" />));

    expect(screen.getByRole("group")).toBeTruthy();
  });

  it("takes its name from the label with its identifier", () => {
    render(
      offered(
        <ItemGroup id="recent">
          <ItemGroupLabel htmlFor="recent">Recent</ItemGroupLabel>
        </ItemGroup>,
      ),
    );

    expect(screen.getByRole("group", { name: "Recent" })).toBeTruthy();
  });
});
