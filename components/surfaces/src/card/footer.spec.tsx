import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Footer } from "#card/footer.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Footer", () => {
  it("renders a div for the footer slot inside a root", () => {
    const { container } = render(carded(<Footer>Send</Footer>));

    expect(slotElement(container, "card", "footer").tagName).toBe("DIV");
  });

  it("applies the footer slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "footer",
      }),
    ).toStrictEqual([]);
  });

  it("applies the justify class the root is given", () => {
    const { container } = render(composed({ justify: "between" }));

    expect([...slotElement(container, "card", "footer").classList]).toContain(
      variantClass("card__footer", "justify", "between"),
    );
  });
});
