import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Indicator } from "#card/indicator.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Indicator", () => {
  it("renders a div for the indicator slot inside a root", () => {
    const { container } = render(carded(<Indicator>#</Indicator>));

    expect(slotElement(container, "card", "indicator").tagName).toBe("DIV");
  });

  it("applies the indicator slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "indicator",
      }),
    ).toStrictEqual([]);
  });

  it("forwards aria-hidden to its element", () => {
    const { container } = render(carded(<Indicator aria-hidden>#</Indicator>));

    expect(slotElement(container, "card", "indicator").getAttribute("aria-hidden")).toBe("true");
  });
});
