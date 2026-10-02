import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Separator } from "#sidebar/separator.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Separator", () => {
  it("renders an hr inside the root", () => {
    const { container } = render(aside(<Separator />));

    expect(slotElement(container, "sidebar", "separator").tagName).toBe("HR");
  });

  it("exposes the separator role", () => {
    render(aside(<Separator />));

    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("leaves the accessibility tree when aria-hidden is passed", () => {
    render(aside(<Separator aria-hidden />));

    expect(screen.queryByRole("separator")).toBeNull();
  });
});
