import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { cropped } from "#image-cropper/image-cropper.fixtures.tsx";

function handlesIn(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(".image-cropper__handle")];
}

describe("Handle", () => {
  it("renders one handle per position", async () => {
    const { container } = await drawn(cropped());

    expect(handlesIn(container).map((handle) => handle.dataset["position"])).toStrictEqual([
      "nw",
      "n",
      "ne",
      "e",
      "se",
      "s",
      "sw",
      "w",
    ]);
  });

  it("hides a handle from assistive technology", async () => {
    const { container } = await drawn(cropped());

    expect(
      handlesIn(container).every((handle) => handle.getAttribute("aria-hidden") === "true"),
    ).toBe(true);
  });

  it("keeps the machine's absolute position with a compass point in position", async () => {
    const { container } = await drawn(cropped());

    expect(handlesIn(container)[0]?.style.position).toBe("absolute");
  });

  it("marks every handle disabled while the crop area is fixed", async () => {
    const { container } = await drawn(cropped({ options: { fixedCropArea: true } }));

    expect(handlesIn(container).every((handle) => handle.dataset["disabled"] === "")).toBe(true);
  });
});
