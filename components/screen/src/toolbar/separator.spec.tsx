import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Separator } from "#toolbar/separator.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Separator", () => {
  it("renders a divider", () => {
    const { container } = render(ranged(<Separator />));

    expect(slotElement(container, "toolbar", "separator")).toBeTruthy();
  });

  it("sets role separator", () => {
    render(ranged(<Separator />));

    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("leaves the accessibility tree with aria-hidden", () => {
    render(ranged(<Separator aria-hidden />));

    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("sets aria-orientation vertical", () => {
    const { container } = render(ranged(<Separator />));

    expect(slotElement(container, "toolbar", "separator").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("applies the vertical divider class", () => {
    const { container } = render(ranged(<Separator />));

    expect(slotElement(container, "toolbar", "separator").className).toContain("divider--vertical");
  });
});
