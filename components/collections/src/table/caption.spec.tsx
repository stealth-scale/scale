import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Caption } from "#table/caption.ts";
import { recipe } from "#table/recipe.ts";
import { Root } from "#table/root.ts";
import { type ScrollerProps } from "#table/scroller.tsx";
import { composed, scrolled } from "#table/table.fixtures.tsx";

describe("Caption", () => {
  it("draws a caption inside the table it needs above it", () => {
    const { container } = render(
      scrolled(
        <Root>
          <Caption>Invoices</Caption>
        </Root>,
      ),
    );

    expect(slotElement(container, "table", "caption").tagName).toBe("CAPTION");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "caption",
      }),
    ).toStrictEqual([]);
  });

  it("sits below the figures a reader returns to it about", () => {
    expect(recipe.base?.["caption"]).toMatchObject({ captionSide: "bottom" });
  });
});
