import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Code } from "#code/code.ts";
import { recipe } from "#code/recipe.ts";

describe("Code", () => {
  it("passes the component conformance checks as a code element", () => {
    expect(violations(Code, { as: true, children: true, element: "CODE" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Code, { props: { children: "npm" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Code {...props}>npm</Code>).container),
    ).toStrictEqual([]);
  });

  it("renders a samp element when as is samp", () => {
    const { container } = render(<Code as="samp">npm</Code>);

    expect(recipeElement(container, "code").tagName).toBe("SAMP");
  });
});
