import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Search } from "#sidebar/search.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Search", () => {
  it("renders a div inside the root", () => {
    const { container } = render(aside(<Search />));

    expect(slotElement(container, "sidebar", "search").tagName).toBe("DIV");
  });

  it("renders the field passed as a child", () => {
    const { container } = render(
      aside(
        <Search>
          <input aria-label="Search projects" type="search" />
        </Search>,
      ),
    );

    expect(slotElement(container, "sidebar", "search").querySelector("input")).not.toBeNull();
  });
});
