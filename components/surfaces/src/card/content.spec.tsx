import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Content } from "#card/content.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Content", () => {
  it("renders a DIV for its slot inside a root", () => {
    const { container } = render(carded(<Content>Three lines</Content>));

    expect(slotElement(container, "card", "content").tagName).toBe("DIV");
  });

  it("emits a content-slot class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("renders no role attribute on the band", () => {
    const { container } = render(carded(<Content>Three lines</Content>));

    expect(slotElement(container, "card", "content").hasAttribute("role")).toBe(false);
  });
});
