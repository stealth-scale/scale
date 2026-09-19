import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Item } from "#grid/item.ts";
import { recipe } from "#grid/recipe.ts";
import { Root } from "#grid/root.ts";

function laid(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Item", () => {
  it("conforms as a div element inside the root it needs above it", () => {
    expect(
      violations(Item, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "grid", "item"),
        wrapper: laid,
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root>
              <Item {...props}>One</Item>
            </Root>,
          ).container,
        { slot: "item" },
      ),
    ).toStrictEqual([]);
  });

  it("reaches across the columns its own span names, beside an entry reaching further", () => {
    const { container } = render(
      <Root columns="12">
        <Item span="8">Article</Item>
        <Item span="4">Aside</Item>
      </Root>,
    );
    const entries = [...container.querySelectorAll<HTMLElement>(".grid__item")];

    expect(entries[0]?.classList.contains(slotVariantClass("grid", "item", "span", "8"))).toBe(
      true,
    );
    expect(entries[1]?.classList.contains(slotVariantClass("grid", "item", "span", "4"))).toBe(
      true,
    );
  });
});
