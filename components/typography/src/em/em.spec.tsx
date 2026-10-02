import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Em } from "#em/em.ts";
import { recipe } from "#em/recipe.ts";

describe("Em", () => {
  it("passes the component conformance checks as an em element", () => {
    expect(violations(Em, { as: true, children: true, element: "EM" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Em, { props: { children: "stressed" } }),
    ).resolves.toStrictEqual([]);
  });

  it("exposes the emphasis role", () => {
    render(<Em>stressed</Em>);

    expect(screen.getByRole("emphasis").textContent).toBe("stressed");
  });

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Em {...props}>stressed</Em>).container),
    ).toStrictEqual([]);
  });

  it("renders an i element when as is i", () => {
    const { container } = render(<Em as="i">Beagle</Em>);

    expect(recipeElement(container, "em").tagName).toBe("I");
  });
});
