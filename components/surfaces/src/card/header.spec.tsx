import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Header } from "#card/header.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Header", () => {
  it("renders a div for the header slot inside a root", () => {
    const { container } = render(carded(<Header>Invoice</Header>));

    expect(slotElement(container, "card", "header").tagName).toBe("DIV");
  });

  it("applies the header slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "header",
      }),
    ).toStrictEqual([]);
  });

  it("renders no role attribute", () => {
    const { container } = render(carded(<Header>Invoice</Header>));

    expect(slotElement(container, "card", "header").hasAttribute("role")).toBe(false);
  });
});
