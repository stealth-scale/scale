import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Bar, Frame, Picker, Root, Size, Stage } from "#device/parts.ts";
import { recipe } from "#device/recipe.ts";

/**
 * Puts a part where it belongs: under a root.
 */
function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

const BOXES = [
  ["bar", Bar],
  ["picker", Picker],
  ["size", Size],
  ["stage", Stage],
] as const;

describe("parts", () => {
  it("conforms as a div element at the root", () => {
    expect(
      violations(Root, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "device", "root"),
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it.each(BOXES)("conforms as a div element for the %s inside the root above it", (slot, Part) => {
    expect(
      violations(Part, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "device", slot),
        wrapper: rooted,
      }),
    ).toStrictEqual([]);
  });

  it("draws the frame as an iframe inside the root above it", () => {
    const { container } = render(rooted(<Frame title="Sizes" />));

    expect(slotElement(container, "device", "frame").tagName).toBe("IFRAME");
  });
});
