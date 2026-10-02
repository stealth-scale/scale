import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, fielded } from "#field/field.fixtures.tsx";
import { OptionalIndicator } from "#field/optional-indicator.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("OptionalIndicator", () => {
  it("renders nothing while the field requires a value", () => {
    render(fielded(<OptionalIndicator />, { required: true }));

    expect(screen.queryByText("(optional)")).toBeNull();
  });

  it("renders a span while the field is optional", () => {
    const { container } = render(fielded(<OptionalIndicator />));

    expect(slotElement(container, "field", "optionalIndicator").tagName).toBe("SPAN");
  });

  it("reads (optional) without children", () => {
    render(fielded(<OptionalIndicator />));

    expect(screen.getByText("(optional)")).toBeDefined();
  });

  it("renders the words given as children", () => {
    render(fielded(<OptionalIndicator>(if you like)</OptionalIndicator>));

    expect(screen.getByText("(if you like)")).toBeDefined();
  });

  it("adds its words to the label's accessible name", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: "Email (optional)" })).toBeDefined();
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "optionalIndicator",
      }),
    ).toStrictEqual([]);
  });
});
