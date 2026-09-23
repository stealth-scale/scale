import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Content } from "#blockquote/content.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

function quoted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Content", () => {
  it("passes the component conformance checks as a blockquote element inside Root", () => {
    expect(
      violations(Content, {
        as: true,
        children: true,
        element: "BLOCKQUOTE",
        subject: (container) => slotElement(container, "blockquote", "content"),
        wrapper: quoted,
      }),
    ).toStrictEqual([]);
  });

  it("applies the class of every variant value to the content slot", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Content>Said</Content>
            </Root>,
          ).container,
        { slot: "content" },
      ),
    ).toStrictEqual([]);
  });
});
