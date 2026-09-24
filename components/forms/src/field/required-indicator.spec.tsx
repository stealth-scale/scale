import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { RequiredIndicator } from "#field/required-indicator.tsx";
import { type RootProps } from "#field/root.tsx";

describe("RequiredIndicator", () => {
  it("renders nothing while the field is optional", () => {
    render(fielded(<RequiredIndicator />));

    expect(screen.queryByText("*")).toBeNull();
  });

  it("renders a span while the field requires a value", () => {
    const { container } = render(fielded(<RequiredIndicator />, { required: true }));

    expect(slotElement(container, "field", "requiredIndicator").tagName).toBe("SPAN");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) => render(composed({ ...props, required: true })).container,
        { slot: "requiredIndicator" },
      ),
    ).toStrictEqual([]);
  });

  it("hides the mark from assistive technology", () => {
    const { container } = render(composed({ required: true }));

    expect(slotElement(container, "field", "requiredIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
