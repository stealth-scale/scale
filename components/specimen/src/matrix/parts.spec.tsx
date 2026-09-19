import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Cell, Grid, Head, Item, Label, Root, Row, Side } from "#matrix/parts.ts";
import { recipe } from "#matrix/recipe.ts";

/**
 * Puts a part where it belongs: under a root.
 */
function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

const PARTS = [
  ["grid", Grid],
  ["head", Head],
  ["row", Row],
  ["side", Side],
  ["cell", Cell],
  ["item", Item],
  ["label", Label],
] as const;

describe("parts", () => {
  it("conforms as a div element at the root", () => {
    expect(
      violations(Root, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "matrix", "root"),
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it.each(PARTS)(
    "conforms as a div element for the %s inside the root it needs above it",
    (slot, Part) => {
      expect(
        violations(Part, {
          as: true,
          children: true,
          element: "DIV",
          subject: (container) => slotElement(container, "matrix", slot),
          wrapper: rooted,
        }),
      ).toStrictEqual([]);
    },
  );
});
