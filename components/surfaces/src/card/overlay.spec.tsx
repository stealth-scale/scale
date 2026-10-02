import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Media } from "#card/media.ts";
import { Overlay } from "#card/overlay.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Overlay", () => {
  it("renders a div for the overlay slot inside the media", () => {
    const { container } = render(
      carded(
        <Media>
          <img alt="" src="/invoice.png" />
          <Overlay>New</Overlay>
        </Media>,
      ),
    );

    expect(slotElement(container, "card", "overlay").parentElement).toBe(
      slotElement(container, "card", "media"),
    );
  });

  it("applies the overlay slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "overlay",
      }),
    ).toStrictEqual([]);
  });
});
