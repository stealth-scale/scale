import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Body } from "#table/body.ts";
import { Cell } from "#table/cell.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { Row } from "#table/row.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Row", () => {
  it("draws a tr inside the table it needs above it", () => {
    const { container } = render(
      scrolled(
        <Root>
          <Body>
            <Row>
              <Cell>Fathom</Cell>
            </Row>
          </Body>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "row").tagName).toBe("TR");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "row",
      }),
    ).toStrictEqual([]);
  });

  it("says it is the one a caller picked off the attribute a screen reader reads", () => {
    render(
      scrolled(
        <Root>
          <Body>
            <Row aria-selected>
              <Cell>Fathom</Cell>
            </Row>
          </Body>
        </Root>,
      ),
    );

    expect(screen.getByRole("row").getAttribute("aria-selected")).toBe("true");
  });
});
