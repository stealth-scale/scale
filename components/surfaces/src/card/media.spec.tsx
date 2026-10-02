import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Media } from "#card/media.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Media", () => {
  it("renders a div for the media slot inside a root", () => {
    const { container } = render(
      carded(
        <Media>
          <img alt="" src="/invoice.png" />
        </Media>,
      ),
    );

    expect(slotElement(container, "card", "media").tagName).toBe("DIV");
  });

  it("applies the media slot class for every variant value", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "media",
      }),
    ).toStrictEqual([]);
  });

  it("renders no aria-label of its own", () => {
    const { container } = render(
      carded(
        <Media>
          <img alt="An invoice" src="/invoice.png" />
        </Media>,
      ),
    );

    expect(slotElement(container, "card", "media").hasAttribute("aria-label")).toBe(false);
  });
});
