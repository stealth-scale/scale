import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#carousel/carousel.fixtures.tsx";

describe("Control", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "carousel", "control").tagName).toBe("DIV");
  });

  it("marks the row with the carousel's orientation", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "carousel", "control").dataset["orientation"]).toBe("vertical");
  });
});
