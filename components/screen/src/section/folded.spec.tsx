import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Folded } from "#section/folded.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Folded", () => {
  it("renders a button", () => {
    const { container } = render(blocked(<Folded aria-label="More billing actions" />));

    expect(slotElement(container, "section", "folded").tagName).toBe("BUTTON");
  });

  it("sets type button", () => {
    render(blocked(<Folded aria-label="More billing actions" />));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("takes its name from aria-label", () => {
    render(blocked(<Folded aria-label="More billing actions" />));

    expect(screen.getByRole("button", { name: "More billing actions" })).toBeTruthy();
  });
});
