import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded } from "#code-block/code-block.fixtures.tsx";
import { Header } from "#code-block/header.ts";
import { recipe } from "#code-block/recipe.ts";

describe("Header", () => {
  it("conforms as a div inside the panel it needs above it", () => {
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

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(coded(<Header />, props)).container, {
        slot: "header",
      }),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(coded(<Header as="header" />));

    expect(slotElement(container, "code-block", "header").tagName).toBe("HEADER");
  });
});
