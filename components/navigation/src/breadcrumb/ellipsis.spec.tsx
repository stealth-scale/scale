import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Ellipsis } from "#breadcrumb/ellipsis.ts";

describe("Ellipsis", () => {
  it("draws a row of the list it stands in", () => {
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

  it("says how many steps it stands for where a caller names them", () => {
    const { container } = render(trailed(<Ellipsis aria-label="4 more steps">…</Ellipsis>));

    expect(slotElement(container, "breadcrumb", "ellipsis").getAttribute("aria-label")).toBe(
      "4 more steps",
    );
  });

  it("is read rather than hidden, so a skipped trail is not read as a short one", () => {
    const { container } = render(trailed(<Ellipsis>…</Ellipsis>));
    const mark = slotElement(container, "breadcrumb", "ellipsis");

    expect(mark.hasAttribute("aria-hidden")).toBe(false);
    expect(mark.getAttribute("role")).toBeNull();
  });
});
