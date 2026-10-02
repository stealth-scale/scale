import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Start } from "#toolbar/start.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Start", () => {
  it("renders a div", () => {
    const { container } = render(ranged(<Start>Filter</Start>));

    expect(slotElement(container, "toolbar", "start").tagName).toBe("DIV");
  });
});
