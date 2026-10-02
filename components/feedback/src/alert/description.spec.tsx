import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Description } from "#alert/description.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Description", () => {
  it("renders a span by default", () => {
    const { container } = render(alerted(<Description>The card was declined.</Description>));

    expect(slotElement(container, "alert", "description").tagName).toBe("SPAN");
  });

  it("applies the class of every variant value set on the root", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "description",
      }),
    ).toStrictEqual([]);
  });

  it("inherits the root's color", () => {
    expect(recipe.base?.["description"]).toMatchObject({ color: "inherit" });
  });

  it("renders the element passed as as", () => {
    const { container } = render(alerted(<Description as="div">Two lines.</Description>));

    expect(slotElement(container, "alert", "description").tagName).toBe("DIV");
  });
});
