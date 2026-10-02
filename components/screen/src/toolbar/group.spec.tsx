import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, slotElement, variantClass } from "@stealthscale/testing-theme";

import { Group } from "#toolbar/group.ts";
import { Item } from "#toolbar/item.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Group", () => {
  it("renders a div with the recipe's group class", () => {
    const { container } = render(ranged(<Group>controls</Group>));

    expect(slotElement(container, "toolbar", "group").tagName).toBe("DIV");
  });

  it("attaches its controls", () => {
    const { container } = render(ranged(<Group>controls</Group>));

    expect(recipeClasses(container, "group")).toContain(variantClass("group", "attached", "true"));
  });

  it("keeps one tab stop across the controls in it", () => {
    render(
      ranged(
        <Group>
          <Item>Bold</Item>
          <Item>Italic</Item>
        </Group>,
      ),
    );

    expect(screen.getAllByRole("button").filter((control) => control.tabIndex === 0)).toHaveLength(
      1,
    );
  });
});
