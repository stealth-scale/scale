import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#grid/item.ts";
import { recipe } from "#grid/recipe.ts";
import { Root } from "#grid/root.ts";

describe("Root", () => {
  it("passes the component conformance checks as a div element", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with an item", async () => {
    await expect(
      accessibilityViolations(Root, { props: { children: <Item>One</Item> } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value to the root slot", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("renders a ul when as is ul", () => {
    const { container } = render(<Root as="ul" />);

    expect(slotElement(container, "grid", "root").tagName).toBe("UL");
  });
});
