import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { offered } from "#listbox/listbox.fixtures.tsx";
import { ValueText } from "#listbox/value-text.tsx";

describe("ValueText", () => {
  it("renders a span", () => {
    const { container } = render(offered(<ValueText />));

    expect(slotElement(container, "listbox", "valueText").tagName).toBe("SPAN");
  });

  it("renders the placeholder while nothing is selected", () => {
    render(offered(<ValueText placeholder="Nothing chosen" />));

    expect(screen.getByText("Nothing chosen")).toBeTruthy();
  });

  it("renders the selected row's text", () => {
    render(offered(<ValueText placeholder="Nothing chosen" />, { value: ["reports"] }));

    expect(screen.getByText("Reports")).toBeTruthy();
  });

  it("renders its children in place of the text and the placeholder", () => {
    render(offered(<ValueText placeholder="Nothing chosen">Three places</ValueText>));

    expect(screen.getByText("Three places")).toBeTruthy();
  });
});
