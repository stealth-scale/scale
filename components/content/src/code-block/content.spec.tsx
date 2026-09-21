import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded } from "#code-block/code-block.fixtures.tsx";
import { Content } from "#code-block/content.ts";
import { recipe } from "#code-block/recipe.ts";

describe("Content", () => {
  it("satisfies the component contract with pre as its default element", () => {
    expect(
      violations(Content, {
        as: true,
        children: true,
        element: "PRE",
        subject: (container) => slotElement(container, "code-block", "content"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Content />, props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("renders the content slot as div when as is div", () => {
    const { container } = render(coded(<Content as="div" />));

    expect(slotElement(container, "code-block", "content").tagName).toBe("DIV");
  });
});
