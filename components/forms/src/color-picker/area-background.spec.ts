import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picker } from "#color-picker/color-picker.fixtures.tsx";

describe("AreaBackground", () => {
  it("renders a div inside the area", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "areaBackground").parentElement).toBe(
      slotElement(container, "color-picker", "area"),
    );
  });
});
