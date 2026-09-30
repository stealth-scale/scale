import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { cropped, loaded } from "#image-cropper/image-cropper.fixtures.tsx";

describe("Selection", () => {
  it("renders a slider in the tab order", async () => {
    await drawn(cropped());

    expect(screen.getByRole("slider", { hidden: true }).tabIndex).toBe(0);
  });

  it("takes the caller's aria-label", async () => {
    const { container } = await drawn(cropped({ selection: { "aria-label": "Crop area" } }));

    await loaded(container);

    expect(screen.getByRole("slider", { name: "Crop area" })).toBeDefined();
  });

  it("writes the value text from valueText with the rounded crop", async () => {
    const { container } = await drawn(
      cropped({
        options: { initialCrop: { height: 255.6, width: 383.4, x: 47.6, y: 32.4 } },
        selection: { valueText: (crop) => `${String(crop.width)} by ${String(crop.height)}` },
      }),
    );

    await loaded(container);

    expect(screen.getByRole("slider", { hidden: true }).getAttribute("aria-valuetext")).toBe(
      "383 by 256",
    );
  });

  it("keeps the machine's English value text without valueText", async () => {
    const { container } = await drawn(cropped());

    await loaded(container);

    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe(
      "Position X 48px, Y 32px. Size 384px by 256px.",
    );
  });

  it("moves the crop on ArrowRight", async () => {
    const { container } = await drawn(cropped());

    await loaded(container);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    await settled();

    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("49");
  });

  it("marks a circle crop with data-shape", async () => {
    await drawn(cropped({ options: { aspectRatio: 1, cropShape: "circle" } }));

    expect(screen.getByRole("slider", { hidden: true }).dataset["shape"]).toBe("circle");
  });
});
