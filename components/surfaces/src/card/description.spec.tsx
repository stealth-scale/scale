import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Description } from "#card/description.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Description", () => {
  it("renders a p for the description slot inside a root", () => {
    const { container } = render(carded(<Description>Issued today</Description>));

    expect(slotElement(container, "card", "description").tagName).toBe("P");
  });

  it("applies the description slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "description",
      }),
    ).toStrictEqual([]);
  });

  it("renders its children as its text", () => {
    const { container } = render(carded(<Description>Issued today</Description>));

    expect(slotElement(container, "card", "description").textContent).toBe("Issued today");
  });
});
