import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Toolbar } from "#page/toolbar.tsx";

describe("Toolbar", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Toolbar>Filters</Toolbar>));

    expect(slotElement(container, "page", "toolbar").tagName).toBe("DIV");
  });

  it("sets data-sticky when sticky", () => {
    const { container } = render(paged(<Toolbar sticky>Filters</Toolbar>));

    expect(slotElement(container, "page", "toolbar").dataset["sticky"]).toBe("");
  });
});
