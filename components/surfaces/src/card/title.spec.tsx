import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";
import { Title } from "#card/title.ts";

describe("Title", () => {
  it("renders an h3 for the title slot inside a root", () => {
    const { container } = render(carded(<Title>Invoice</Title>));

    expect(slotElement(container, "card", "title").tagName).toBe("H3");
  });

  it("applies the title slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "title",
      }),
    ).toStrictEqual([]);
  });

  it("exposes a level 3 heading named by its text", () => {
    render(carded(<Title>Invoice</Title>));

    expect(screen.getByRole("heading", { level: 3, name: "Invoice" })).toBeDefined();
  });

  it("renders the heading level passed as as", () => {
    render(carded(<Title as="h2">Invoice</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Invoice" })).toBeDefined();
  });
});
