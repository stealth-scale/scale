import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { AreaThumb } from "#color-picker/area-thumb.tsx";
import { Area } from "#color-picker/area.tsx";
import { keyed, opened, picker, slider } from "#color-picker/color-picker.fixtures.tsx";

describe("AreaThumb", () => {
  it("renders a slider named after saturation and brightness", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Saturation and brightness").tagName).toBe("DIV");
  });

  it("reads both channels in its value text", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Saturation and brightness").getAttribute("aria-valuetext")).toBe(
      "Saturation 84%, brightness 92%",
    );
  });

  it("reads saturation and lightness while the format is HSL", async () => {
    await drawn(picker({ format: "hsla" }));
    await opened();

    expect(slider("Saturation and lightness").getAttribute("aria-valuetext")).toBe(
      "Saturation 83%, lightness 53%",
    );
  });

  it("takes the name passed as label", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <Area>
              <AreaThumb label="Tint" />
            </Area>
          ),
        },
      ),
    );
    await opened();

    expect(slider("Tint")).toBeDefined();
  });

  it("takes the value text passed as valueText", async () => {
    await drawn(
      picker(
        {},
        {
          panel: (
            <Area>
              <AreaThumb valueText="Vivid" />
            </Area>
          ),
        },
      ),
    );
    await opened();

    expect(slider("Saturation and brightness").getAttribute("aria-valuetext")).toBe("Vivid");
  });

  it("fills itself with the color under it through --color-picker-thumb", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Saturation and brightness").style.getPropertyValue("--color-picker-thumb")).toBe(
      "hsla(221.21, 83.2%, 53.33%, 1)",
    );
  });

  it("leaves out the fill the machine writes inline", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Saturation and brightness").style.background).toBe("");
  });

  it("drops the machine's role description", async () => {
    await drawn(picker());
    await opened();

    expect(slider("Saturation and brightness").hasAttribute("aria-roledescription")).toBe(false);
  });

  it("steps the saturation down on ArrowLeft", async () => {
    await drawn(picker());
    await opened();
    await keyed(slider("Saturation and brightness"), "ArrowLeft");

    expect(slider("Saturation and brightness").getAttribute("aria-valuenow")).toBe("83");
  });
});
