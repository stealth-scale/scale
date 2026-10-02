import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Tabs } from "#page/tabs.ts";

describe("Tabs", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Tabs>Lines</Tabs>));

    expect(slotElement(container, "page", "tabs").tagName).toBe("DIV");
  });

  it("renders the element as names", () => {
    const { container } = render(paged(<Tabs as="ul">Lines</Tabs>));

    expect(slotElement(container, "page", "tabs").tagName).toBe("UL");
  });
});
