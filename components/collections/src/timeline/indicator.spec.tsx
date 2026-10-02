import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Connector } from "#timeline/connector.ts";
import { Indicator } from "#timeline/indicator.ts";
import { listed } from "#timeline/timeline.fixtures.tsx";

describe("Indicator", () => {
  it("renders a SPAN for the indicator slot", () => {
    const { container } = render(
      listed(
        <Connector>
          <Indicator>1</Indicator>
        </Connector>,
      ),
    );

    expect(slotElement(container, "timeline", "indicator").tagName).toBe("SPAN");
  });

  it("hides itself from screen readers by default", () => {
    const { container } = render(
      listed(
        <Connector>
          <Indicator>1</Indicator>
        </Connector>,
      ),
    );

    expect(slotElement(container, "timeline", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
