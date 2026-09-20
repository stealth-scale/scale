import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnGroup } from "#table/column-group.ts";
import { Column } from "#table/column.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Column", () => {
  it("draws a col inside the group it needs above it", () => {
    const { container } = render(
      scrolled(
        <Root>
          <ColumnGroup>
            <Column />
          </ColumnGroup>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "column").tagName).toBe("COL");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "column",
      }),
    ).toStrictEqual([]);
  });

  it("states a width the columns take rather than the first row's cells", () => {
    const { container } = render(
      scrolled(
        <Root>
          <ColumnGroup>
            <Column span={2} />
          </ColumnGroup>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "column").getAttribute("span")).toBe("2");
  });
});
