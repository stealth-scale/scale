import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";
import { Section } from "#card/section.ts";

describe("Section", () => {
  it("renders a div for the section slot inside a root", () => {
    const { container } = render(carded(<Section>Paid in full</Section>));

    expect(slotElement(container, "card", "section").tagName).toBe("DIV");
  });

  it("applies the section slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "section",
      }),
    ).toStrictEqual([]);
  });

  it("renders no role attribute", () => {
    const { container } = render(carded(<Section>Paid in full</Section>));

    expect(slotElement(container, "card", "section").hasAttribute("role")).toBe(false);
  });
});
