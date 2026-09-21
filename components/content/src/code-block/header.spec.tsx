import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded } from "#code-block/code-block.fixtures.tsx";
import { Header } from "#code-block/header.ts";
import { recipe } from "#code-block/recipe.ts";

describe("Header", () => {
  it("satisfies the component contract with div as its default element", () => {
    expect(
      violations(Header, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "code-block", "header"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Header />, props)).container, {
        slot: "header",
      }),
    ).toStrictEqual([]);
  });

  it("renders the header slot as header when as is header", () => {
    const { container } = render(coded(<Header as="header" />));

    expect(slotElement(container, "code-block", "header").tagName).toBe("HEADER");
  });
});
