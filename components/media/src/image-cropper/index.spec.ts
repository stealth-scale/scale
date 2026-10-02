import { describe, expect, it } from "vitest";

import { rootedViolations } from "@stealthscale/testing-react";

import * as barrel from "#image-cropper/index.ts";

describe("index", () => {
  it("exports six parts with useImageCropper plus handles", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Grid",
      "Handle",
      "Image",
      "Root",
      "Selection",
      "Viewport",
      "handles",
      "useImageCropper",
    ]);
  });

  it("lists the eight handle positions", () => {
    expect(barrel.handles).toStrictEqual(["nw", "n", "ne", "e", "se", "s", "sw", "w"]);
  });

  it("throws for every part rendered outside a root", () => {
    const { Grid, Handle, Image, Selection, Viewport } = barrel;

    expect(
      rootedViolations(
        { Grid, Handle, Image, Selection, Viewport },
        "A part of ImageCropper was drawn outside the root that holds it together.",
      ),
    ).toStrictEqual([]);
  });
});
