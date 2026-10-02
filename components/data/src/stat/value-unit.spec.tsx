import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { stated } from "#stat/stat.fixtures.tsx";
import { ValueText } from "#stat/value-text.ts";
import { ValueUnit } from "#stat/value-unit.ts";

describe("ValueUnit", () => {
  it("renders a SPAN inside the figure", () => {
    const { container } = render(
      stated(
        <ValueText>
          3<ValueUnit>hr</ValueUnit>
        </ValueText>,
      ),
    );

    expect(slotElement(container, "stat", "valueUnit").tagName).toBe("SPAN");
  });
});
