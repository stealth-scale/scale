import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Cell } from "#table/cell.ts";
import { Footer } from "#table/footer.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { Row } from "#table/row.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Footer", () => {
  it("draws a tfoot inside the table it needs above it", () => {
    const { container } = render(
      scrolled(
        <Root>
          <Footer>
            <Row>
              <Cell>1,536.50</Cell>
            </Row>
          </Footer>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "footer").tagName).toBe("TFOOT");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "footer",
      }),
    ).toStrictEqual([]);
  });
});
