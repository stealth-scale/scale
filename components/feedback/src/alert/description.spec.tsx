import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Description } from "#alert/description.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Description", () => {
  it("renders a span for the description slot", () => {
    const { container } = render(alerted(<Description>The card was declined.</Description>));

    expect(slotElement(container, "alert", "description").tagName).toBe("SPAN");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "description",
      }),
    ).toStrictEqual([]);
  });

  it("declares color inherit in its base styles", () => {
    expect(recipe.base?.["description"]).toMatchObject({ color: "inherit" });
  });

  it("renders the element named by as instead of a span", () => {
    const { container } = render(alerted(<Description as="div">Two lines.</Description>));

    expect(slotElement(container, "alert", "description").tagName).toBe("DIV");
  });
});
