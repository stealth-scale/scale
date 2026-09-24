import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Folded } from "#page/folded.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Folded", () => {
  it("renders a button", () => {
    const { container } = render(paged(<Folded aria-label="More actions" />));

    expect(slotElement(container, "page", "folded").tagName).toBe("BUTTON");
  });

  it("sets type button", () => {
    render(paged(<Folded aria-label="More actions" />));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("takes its name from aria-label", () => {
    render(paged(<Folded aria-label="More invoice actions" />));

    expect(screen.getByRole("button", { name: "More invoice actions" })).toBeTruthy();
  });
});
