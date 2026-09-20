import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Body } from "#table/body.ts";
import { Cell } from "#table/cell.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { Row } from "#table/row.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Body", () => {
  it("draws a tbody inside the table it needs above it", () => {
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

    expect(slotElement(container, "table", "body").tagName).toBe("TBODY");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "body",
      }),
    ).toStrictEqual([]);
  });
});
