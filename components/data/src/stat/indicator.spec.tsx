import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { HelpText } from "#stat/help-text.ts";
import { Indicator } from "#stat/indicator.ts";
import { stated } from "#stat/stat.fixtures.tsx";

describe("Indicator", () => {
  it("renders a SPAN for the indicator slot", () => {
    const { container } = render(
      stated(
        <HelpText>
          <Indicator>+</Indicator>
        </HelpText>,
      ),
    );

    expect(slotElement(container, "stat", "indicator").tagName).toBe("SPAN");
  });

  it("renders the glyph the caller passes as its child", () => {
    const { container } = render(
      stated(
        <HelpText>
          <Indicator>
            <svg aria-hidden />
          </Indicator>
        </HelpText>,
      ),
    );

    expect(slotElement(container, "stat", "indicator").firstElementChild?.tagName).toBe("svg");
  });
});
