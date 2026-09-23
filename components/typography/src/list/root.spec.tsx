import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#list/item.ts";
import { recipe } from "#list/recipe.ts";
import { Root } from "#list/root.ts";

describe("Root", () => {
  it("passes the component conformance checks as a ul element", () => {
    expect(violations(Root, { as: true, children: true, element: "UL" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with an item", async () => {
    await expect(
      accessibilityViolations(Root, { props: { children: <Item>One</Item> } }),
    ).resolves.toStrictEqual([]);
  });

  it("sets the list role", () => {
    const { container } = render(<Root />);

    expect(recipeElement(container, "list").getAttribute("role")).toBe("list");
  });

  it("applies the class of every variant value to the root slot", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("renders an ol when as is ol", () => {
    const { container } = render(<Root as="ol" />);

    expect(slotElement(container, "list", "root").tagName).toBe("OL");
  });
});
