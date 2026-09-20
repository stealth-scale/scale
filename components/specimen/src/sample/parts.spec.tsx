import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Body, Head, Root } from "#sample/parts.ts";
import { recipe } from "#sample/recipe.ts";

/**
 * Puts a part where it belongs: under a root.
 */
function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

const PARTS = [
  ["caption", Head],
  ["body", Body],
] as const;

describe("parts", () => {
  it("conforms as a div element at the root", () => {
    expect(
      violations(Root, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "sample", "root"),
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
          subject: (container) => slotElement(container, "sample", slot),
          wrapper: rooted,
        }),
      ).toStrictEqual([]);
    },
  );
});
