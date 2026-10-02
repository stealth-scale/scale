import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { End } from "#toolbar/end.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("End", () => {
  it("renders a div", () => {
    const { container } = render(ranged(<End>Download</End>));

    expect(slotElement(container, "toolbar", "end").tagName).toBe("DIV");
  });
});
