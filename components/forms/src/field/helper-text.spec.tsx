import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, fielded } from "#field/field.fixtures.tsx";
import { HelperText } from "#field/helper-text.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("HelperText", () => {
  it("draws a p inside the field it needs above it", () => {
    const { container } = render(fielded(<HelperText>A format</HelperText>));

    expect(slotElement(container, "field", "helperText").tagName).toBe("P");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "helperText",
      }),
    ).toStrictEqual([]);
  });

  it("carries the identifier the control is described by", () => {
    const { container } = render(composed({ id: "email" }));

    expect(slotElement(container, "field", "helperText").getAttribute("id")).toBe("email-helper");
  });

  it("gives its place to the error text where the field is wrong", () => {
    const { container } = render(composed({ invalid: true }));

    expect(container.querySelector(".field__helper-text")).toBeNull();
  });
});
