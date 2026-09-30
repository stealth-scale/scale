import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#timeline/timeline.fixtures.tsx";

describe("Item", () => {
  it("renders an LI for the item slot", () => {
    const { container } = render(listed(null));

    expect(slotElement(container, "timeline", "item").tagName).toBe("LI");
  });
});
