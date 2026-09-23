import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Separator } from "#breadcrumb/separator.ts";

describe("Separator", () => {
  it("conforms as a list item inside the root", () => {
    expect(
      violations(Separator, {
        as: true,
        children: true,
        element: "LI",
        subject: (container) => slotElement(container, "breadcrumb", "separator"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("hides the list item from the accessibility tree", () => {
    const { container } = render(trailed(<Separator>/</Separator>));
    const mark = slotElement(container, "breadcrumb", "separator");

    expect(mark.getAttribute("aria-hidden")).toBe("true");
    expect(mark.getAttribute("role")).toBe("presentation");
  });
});
