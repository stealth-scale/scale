import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Caption } from "#blockquote/caption.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

function quoted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Caption", () => {
  it("passes the component conformance checks as a figcaption element inside Root", () => {
    expect(
      violations(Caption, {
        as: true,
        children: true,
        element: "FIGCAPTION",
        subject: (container) => slotElement(container, "blockquote", "caption"),
        wrapper: quoted,
      }),
    ).toStrictEqual([]);
  });

  it("applies the class of every variant value to the caption slot", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Caption>Someone</Caption>
            </Root>,
          ).container,
        { slot: "caption" },
      ),
    ).toStrictEqual([]);
  });
});
