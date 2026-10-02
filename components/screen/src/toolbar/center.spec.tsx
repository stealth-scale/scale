import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Center } from "#toolbar/center.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Center", () => {
  it("renders a div", () => {
    const { container } = render(ranged(<Center>April</Center>));

    expect(slotElement(container, "toolbar", "center").tagName).toBe("DIV");
  });
});
