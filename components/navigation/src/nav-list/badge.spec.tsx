import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Badge } from "#nav-list/badge.ts";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Badge", () => {
  it("renders a SPAN element inside a list", () => {
    const { container } = render(listed(<Badge>3</Badge>));

    expect(slotElement(container, "nav-list", "badge").tagName).toBe("SPAN");
  });

  it("keeps the count in the DOM when iconic is true", () => {
    render(listed(<Badge>3</Badge>, { iconic: true }));

    expect(screen.getByText("3")).toBeTruthy();
  });
});
