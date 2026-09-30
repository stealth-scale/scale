import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { cropped } from "#image-cropper/image-cropper.fixtures.tsx";

describe("Image", () => {
  it("renders an img with the caller's source", async () => {
    const { container } = await drawn(cropped());

    expect(slotElement(container, "image-cropper", "image").getAttribute("src")).toBe(
      "/photo.webp",
    );
  });

  it("hides the picture from assistive technology with an empty alt", async () => {
    const { container } = await drawn(cropped());
    const image = slotElement(container, "image-cropper", "image");

    expect([image.getAttribute("alt"), image.getAttribute("aria-hidden")]).toStrictEqual([
      "",
      "true",
    ]);
  });
});
