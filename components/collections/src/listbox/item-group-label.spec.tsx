import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ItemGroupLabel } from "#listbox/item-group-label.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemGroupLabel", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ItemGroupLabel htmlFor="recent">Recent</ItemGroupLabel>));

    expect(slotElement(container, "listbox", "itemGroupLabel").tagName).toBe("SPAN");
  });

  it("renders no option", () => {
    render(offered(<ItemGroupLabel htmlFor="recent">Recent</ItemGroupLabel>));

    expect(screen.queryByRole("option")).toBeNull();
  });
});
