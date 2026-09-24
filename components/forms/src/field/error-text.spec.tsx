import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ErrorText } from "#field/error-text.tsx";
import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("ErrorText", () => {
  it("renders nothing while the field is valid and reports no status", () => {
    render(fielded(<ErrorText>Wrong</ErrorText>));

    expect(screen.queryByText("Wrong")).toBeNull();
  });

  it("renders a p while the field is invalid", () => {
    const { container } = render(fielded(<ErrorText>Wrong</ErrorText>, { invalid: true }));

    expect(slotElement(container, "field", "errorText").tagName).toBe("P");
  });

  it("renders without an alert role for a status that is not a fault", () => {
    render(fielded(<ErrorText>Free</ErrorText>, { status: "success" }));

    expect(screen.getByText("Free").hasAttribute("role")).toBe(false);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) => render(composed({ ...props, invalid: true })).container,
        { slot: "errorText" },
      ),
    ).toStrictEqual([]);
  });

  it("sets role alert while the field is invalid", () => {
    render(composed({ invalid: true }));

    expect(screen.getByRole("alert").textContent).toBe("That address is not one we recognise.");
  });

  it("carries the identifier the control's aria-describedby lists", () => {
    const { container } = render(composed({ id: "email", invalid: true }));

    expect(slotElement(container, "field", "errorText").getAttribute("id")).toBe("email-error");
  });
});
