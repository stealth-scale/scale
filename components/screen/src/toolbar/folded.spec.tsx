import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Folded } from "#toolbar/folded.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Folded", () => {
  it("renders a button", () => {
    const { container } = render(ranged(<Folded aria-label="More actions" />));

    expect(slotElement(container, "toolbar", "folded").tagName).toBe("BUTTON");
  });

  it("takes the row's roving tab stop", () => {
    render(ranged(<Folded aria-label="More actions" />));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("takes its name from aria-label", () => {
    render(ranged(<Folded aria-label="More invoice actions" />));

    expect(screen.getByRole("button", { name: "More invoice actions" })).toBeTruthy();
  });
});
