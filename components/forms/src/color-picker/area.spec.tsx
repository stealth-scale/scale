import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { AreaThumb } from "#color-picker/area-thumb.tsx";
import { Area } from "#color-picker/area.tsx";
import { opened, picker, slider } from "#color-picker/color-picker.fixtures.tsx";

describe("Area", () => {
  it("renders a div with role group", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(slotElement(container, "color-picker", "area").getAttribute("role")).toBe("group");
  });

  it("provides the channels of its axes to its thumb", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <Area xChannel="hue" yChannel="saturation">
              <AreaThumb />
            </Area>
          ),
        },
      ),
    );
    await opened();

    expect(slider("Hue and saturation")).toBeDefined();
  });
});
