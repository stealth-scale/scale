import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Group } from "#group/group.ts";
import { recipe } from "#group/recipe.ts";

describe("Group", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Group, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with two buttons", async () => {
    await expect(
      accessibilityViolations(Group, {
        props: {
          children: [
            <button key="one" type="button">
              One
            </button>,
            <button key="two" type="button">
              Two
            </button>,
          ],
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Group {...props}>One</Group>).container),
    ).toStrictEqual([]);
  });

  it("renders a fieldset when as is fieldset", () => {
    const { container } = render(<Group as="fieldset">One</Group>);

    expect(recipeElement(container, "group").tagName).toBe("FIELDSET");
  });
});
