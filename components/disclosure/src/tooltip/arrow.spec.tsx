import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#tooltip/arrow.tsx";
import { hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Arrow", () => {
  it("renders a div", () => {
    const { container } = render(hinted(<Arrow />));

    expect(slotElement(container, "tooltip", "arrow").tagName).toBe("DIV");
  });

  it("takes the machine's absolute position", () => {
    const { container } = render(hinted(<Arrow />));

    expect(slotElement(container, "tooltip", "arrow").style.position).toBe("absolute");
  });

  it("renders the element as names", () => {
    const { container } = render(hinted(<Arrow as="span" />));

    expect(slotElement(container, "tooltip", "arrow").tagName).toBe("SPAN");
  });
});
