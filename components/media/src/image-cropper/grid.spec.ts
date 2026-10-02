import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { cropped } from "#image-cropper/image-cropper.fixtures.tsx";

describe("Grid", () => {
  it("renders one grid per axis", async () => {
    const { container } = await drawn(cropped());

    expect(
      [...container.querySelectorAll<HTMLElement>(".image-cropper__grid")].map(
        (grid) => grid.dataset["axis"],
      ),
    ).toStrictEqual(["horizontal", "vertical"]);
  });

  it("hides a grid from assistive technology", async () => {
    const { container } = await drawn(cropped());

    expect(container.querySelector(".image-cropper__grid")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
