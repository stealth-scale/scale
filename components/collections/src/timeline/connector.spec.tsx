import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Connector } from "#timeline/connector.ts";
import { listed } from "#timeline/timeline.fixtures.tsx";

describe("Connector", () => {
  it("renders a DIV for the connector slot", () => {
    const { container } = render(listed(<Connector />));

    expect(slotElement(container, "timeline", "connector").tagName).toBe("DIV");
  });
});
