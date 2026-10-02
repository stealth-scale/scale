import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { CurrentLink } from "#breadcrumb/current-link.ts";

describe("CurrentLink", () => {
  it("conforms as a span inside the root", () => {
    expect(
      violations(CurrentLink, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "breadcrumb", "currentLink"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(CurrentLink, {
        props: { children: "This invoice" },
        wrapper: trailed,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("sets aria-current to page", () => {
    const { container } = render(trailed(<CurrentLink>This invoice</CurrentLink>));

    expect(slotElement(container, "breadcrumb", "currentLink").getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("renders a span by default", () => {
    const { container } = render(trailed(<CurrentLink>This invoice</CurrentLink>));

    expect(slotElement(container, "breadcrumb", "currentLink").tagName).toBe("SPAN");
  });
});
