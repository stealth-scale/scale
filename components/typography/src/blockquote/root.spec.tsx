import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Caption } from "#blockquote/caption.ts";
import { Content } from "#blockquote/content.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

describe("Root", () => {
  it("passes the component conformance checks as a figure element", () => {
    expect(violations(Root, { as: true, children: true, element: "FIGURE" })).toStrictEqual([]);
  });

  it("returns no accessibility violation with content and a caption", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: {
          children: (
            <>
              <Content>Said</Content>
              <Caption>Someone</Caption>
            </>
          ),
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value to the root slot", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("renders an aside when as is aside", () => {
    const { container } = render(<Root as="aside" />);

    expect(slotElement(container, "blockquote", "root").tagName).toBe("ASIDE");
  });
});
