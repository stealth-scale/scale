import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Indicator } from "#alert/indicator.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Indicator", () => {
  it("renders a div for the indicator slot", () => {
    const { container } = render(alerted(<Indicator>!</Indicator>));

    expect(slotElement(container, "alert", "indicator").tagName).toBe("DIV");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "indicator",
      }),
    ).toStrictEqual([]);
  });

  it("sets aria-hidden true when the caller passes no value for it", () => {
    const { container } = render(alerted(<Indicator>!</Indicator>));

    expect(slotElement(container, "alert", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("keeps aria-hidden false when the caller passes that value", () => {
    const { container } = render(alerted(<Indicator aria-hidden={false}>!</Indicator>));

    expect(slotElement(container, "alert", "indicator").getAttribute("aria-hidden")).toBe("false");
  });
});
