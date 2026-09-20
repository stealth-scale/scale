import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnGroup } from "#table/column-group.ts";
import { Column } from "#table/column.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("ColumnGroup", () => {
  it("draws a colgroup inside the table it needs above it", () => {
    const { container } = render(
      scrolled(
        <Root>
          <ColumnGroup>
            <Column />
          </ColumnGroup>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "columnGroup").tagName).toBe("COLGROUP");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "columnGroup",
      }),
    ).toStrictEqual([]);
  });

  it("declares one column per entry it holds", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "columnGroup").children).toHaveLength(2);
  });
});
