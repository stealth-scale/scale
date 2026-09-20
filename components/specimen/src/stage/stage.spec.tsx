import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeClasses } from "@stealthscale/testing-theme";

import { recipe } from "#stage/recipe.ts";
import { Stage } from "#stage/stage.ts";

describe("Stage", () => {
  it("conforms as a div element", () => {
    expect(violations(Stage, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Stage, { props: { children: "Draft" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Stage {...props}>Draft</Stage>).container),
    ).toStrictEqual([]);
  });

  it("holds what it is given", () => {
    const { container } = render(<Stage>Draft</Stage>);

    expect(container.textContent).toBe("Draft");
    expect(recipeClasses(container, "stage")).toContain("stage");
  });
});
