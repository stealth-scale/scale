import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#status/indicator.ts";
import { recipe } from "#status/recipe.ts";
import { Root, type RootProps } from "#status/root.ts";

describe("Indicator", () => {
  it("renders a SPAN for the indicator slot", () => {
    const { container } = render(
      <Root>
        <Indicator />
      </Root>,
    );

    expect(slotElement(container, "status", "indicator").tagName).toBe("SPAN");
  });

  it("sets aria-hidden true when the caller passes no value for it", () => {
    const { container } = render(
      <Root>
        <Indicator />
      </Root>,
    );

    expect(slotElement(container, "status", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("emits a class for every variant value the recipe declares", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) =>
          render(
            <Root {...props}>
              <Indicator />
            </Root>,
          ).container,
        { slot: "indicator" },
      ),
    ).toStrictEqual([]);
  });
});
