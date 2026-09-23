import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Content } from "#empty-state/content.ts";
import { recipe } from "#empty-state/recipe.ts";
import { Root } from "#empty-state/root.ts";
import { Title } from "#empty-state/title.ts";

describe("Root", () => {
  it("conforms as a div element", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation when it holds a content column", async () => {
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

  it("applies the class of every variant value", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("sets no role", () => {
    const { container } = render(<Root />);

    expect(slotElement(container, "empty-state", "root").hasAttribute("role")).toBe(false);
  });

  it("renders the element passed as as", () => {
    const { container } = render(<Root as="section" />);

    expect(slotElement(container, "empty-state", "root").tagName).toBe("SECTION");
  });
});
