import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ColumnHeader } from "#table/column-header.ts";
import { Header } from "#table/header.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { Row } from "#table/row.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Header", () => {
  it("renders a thead", () => {
    const { container } = render(
      scrolled(
        <Root>
          <Header>
            <Row>
              <ColumnHeader>Client</ColumnHeader>
            </Row>
          </Header>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "header").tagName).toBe("THEAD");
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "header",
      }),
    ).toStrictEqual([]);
  });
});
