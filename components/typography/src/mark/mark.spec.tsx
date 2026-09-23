import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Mark } from "#mark/mark.ts";
import { recipe } from "#mark/recipe.ts";

describe("Mark", () => {
  it("passes the component conformance checks as a mark element", () => {
    expect(violations(Mark, { as: true, children: true, element: "MARK" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Mark, { props: { children: "hit" } }),
    ).resolves.toStrictEqual([]);
  });

  it("exposes the mark role", () => {
    render(<Mark>hit</Mark>);

    expect(screen.getByRole("mark").textContent).toBe("hit");
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Mark {...props}>hit</Mark>).container),
    ).toStrictEqual([]);
  });

  it("renders a span when as is span", () => {
    const { container } = render(<Mark as="span">hit</Mark>);

    expect(recipeElement(container, "mark").tagName).toBe("SPAN");
  });
});
