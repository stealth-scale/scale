import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { cropped } from "#image-cropper/image-cropper.fixtures.tsx";

describe("Viewport", () => {
  it("renders a div", async () => {
    const { container } = await drawn(cropped());

    expect(slotElement(container, "image-cropper", "viewport").tagName).toBe("DIV");
  });

  it("clips the picture", async () => {
    const { container } = await drawn(cropped());

    expect(slotElement(container, "image-cropper", "viewport").style.overflow).toBe("hidden");
  });

  it("takes the root's radius", async () => {
    const { container } = await drawn(cropped({ root: { radius: "l3" } }));

    expect(slotElement(container, "image-cropper", "viewport").className).toContain(
      "image-cropper__viewport--l3",
    );
  });
});
