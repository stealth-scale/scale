import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Ellipsis } from "#breadcrumb/ellipsis.ts";

describe("Ellipsis", () => {
  it("renders a list item by default", () => {
    const { container } = render(trailed(<Ellipsis>…</Ellipsis>));

    expect(slotElement(container, "breadcrumb", "ellipsis").tagName).toBe("LI");
  });

  it("conforms as a list item", () => {
    expect(
      violations(Ellipsis, {
        as: true,
        children: true,
        element: "LI",
        subject: (container) => slotElement(container, "breadcrumb", "ellipsis"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("forwards aria-label to the list item", () => {
    const { container } = render(trailed(<Ellipsis aria-label="4 more steps">…</Ellipsis>));

    expect(slotElement(container, "breadcrumb", "ellipsis").getAttribute("aria-label")).toBe(
      "4 more steps",
    );
  });

  it("stays in the accessibility tree by default", () => {
    const { container } = render(trailed(<Ellipsis>…</Ellipsis>));
    const mark = slotElement(container, "breadcrumb", "ellipsis");

    expect(mark.hasAttribute("aria-hidden")).toBe(false);
    expect(mark.getAttribute("role")).toBeNull();
  });
});
