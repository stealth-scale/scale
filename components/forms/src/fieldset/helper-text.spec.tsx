import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, grouped } from "#fieldset/fieldset.fixtures.tsx";
import { HelperText } from "#fieldset/helper-text.tsx";
import { recipe } from "#fieldset/recipe.ts";
import { type RootProps } from "#fieldset/root.tsx";

describe("HelperText", () => {
  it("renders a p inside the root", () => {
    const { container } = render(grouped(<HelperText>On weekdays</HelperText>));

    expect(slotElement(container, "fieldset", "helperText").tagName).toBe("P");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "helperText",
      }),
    ).toStrictEqual([]);
  });

  it("carries the identifier the root's aria-describedby lists", () => {
    const { container } = render(composed({ id: "delivery" }));

    expect(slotElement(container, "fieldset", "helperText").getAttribute("id")).toBe(
      "delivery-helper",
    );
  });
});
