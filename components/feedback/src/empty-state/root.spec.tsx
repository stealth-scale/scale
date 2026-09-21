import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Content } from "#empty-state/content.ts";
import { recipe } from "#empty-state/recipe.ts";
import { Root } from "#empty-state/root.ts";
import { Title } from "#empty-state/title.ts";

describe("Root", () => {
  it("meets the component contract as a div element", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("reports no axe violation wrapping a content column and a title", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: {
          children: (
            <Content>
              <Title>Nothing here yet</Title>
            </Content>
          ),
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("sets no role attribute on the element it renders", () => {
    const { container } = render(<Root />);

    expect(slotElement(container, "empty-state", "root").hasAttribute("role")).toBe(false);
  });

  it("renders the element named by as instead of a div", () => {
    const { container } = render(<Root as="section" />);

    expect(slotElement(container, "empty-state", "root").tagName).toBe("SECTION");
  });
});
