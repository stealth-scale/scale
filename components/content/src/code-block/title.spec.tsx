import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded } from "#code-block/code-block.fixtures.tsx";
import { recipe } from "#code-block/recipe.ts";
import { Title } from "#code-block/title.ts";

describe("Title", () => {
  it("conforms as a div inside the panel it needs above it", () => {
    expect(
      violations(Title, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "code-block", "title"),
        wrapper: coded,
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) => render(coded(<Title>button.tsx</Title>, props)).container,
        {
          slot: "title",
        },
      ),
    ).toStrictEqual([]);
  });

  it("carries no heading role because a block of code is not a section of the page", () => {
    const { container } = render(coded(<Title>button.tsx</Title>));

    expect(slotElement(container, "code-block", "title").hasAttribute("role")).toBe(false);
  });

  it("draws the element as names", () => {
    const { container } = render(coded(<Title as="span">button.tsx</Title>));

    expect(slotElement(container, "code-block", "title").tagName).toBe("SPAN");
  });
});
