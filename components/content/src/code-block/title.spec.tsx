import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { coded } from "#code-block/code-block.fixtures.tsx";
import { recipe } from "#code-block/recipe.ts";
import { Title } from "#code-block/title.ts";

describe("Title", () => {
  it("satisfies the component contract with div as its default element", () => {
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

  it("emits a class for every variant value the recipe declares", () => {
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

  it("sets no role attribute on the title element", () => {
    const { container } = render(coded(<Title>button.tsx</Title>));

    expect(slotElement(container, "code-block", "title").hasAttribute("role")).toBe(false);
  });

  it("renders the title slot as span when as is span", () => {
    const { container } = render(coded(<Title as="span">button.tsx</Title>));

    expect(slotElement(container, "code-block", "title").tagName).toBe("SPAN");
  });
});
