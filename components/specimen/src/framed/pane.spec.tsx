import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeClasses } from "@stealthscale/testing-theme";

import { recipe } from "#framed/pane.recipe.ts";
import { Pane } from "#framed/pane.ts";

describe("Pane", () => {
  it("conforms as a div element", () => {
    expect(violations(Pane, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Pane, { props: { children: "Draft" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Pane {...props}>Draft</Pane>).container),
    ).toStrictEqual([]);
  });

  it("holds what it is given", () => {
    const { container } = render(<Pane>Draft</Pane>);

    expect(container.textContent).toBe("Draft");
    expect(recipeClasses(container, "pane")).toContain("pane");
  });
});
