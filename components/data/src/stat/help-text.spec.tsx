import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { HelpText } from "#stat/help-text.ts";
import { stated } from "#stat/stat.fixtures.tsx";

describe("HelpText", () => {
  it("renders a DD so the description list contains only terms and details", () => {
    const { container } = render(stated(<HelpText>against £14,200 last week</HelpText>));

    expect(slotElement(container, "stat", "helpText").tagName).toBe("DD");
  });
});
