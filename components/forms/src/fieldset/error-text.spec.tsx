import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ErrorText } from "#fieldset/error-text.tsx";
import { composed, grouped } from "#fieldset/fieldset.fixtures.tsx";
import { recipe } from "#fieldset/recipe.ts";
import { type RootProps } from "#fieldset/root.tsx";

describe("ErrorText", () => {
  it("renders nothing while the group is valid and reports no status", () => {
    render(grouped(<ErrorText>Choose one</ErrorText>));

    expect(screen.queryByText("Choose one")).toBeNull();
  });

  it("renders a p while the group is invalid", () => {
    const { container } = render(grouped(<ErrorText>Choose one</ErrorText>, { invalid: true }));

    expect(slotElement(container, "fieldset", "errorText").tagName).toBe("P");
  });

  it("renders without an alert role for a status that is not a fault", () => {
    render(grouped(<ErrorText>Both verified</ErrorText>, { status: "success" }));

    expect(screen.getByText("Both verified").hasAttribute("role")).toBe(false);
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

  it("sets role alert while the group is invalid", () => {
    render(composed({ invalid: true }));

    expect(screen.getByRole("alert").textContent).toBe("Choose one before going on.");
  });
});
