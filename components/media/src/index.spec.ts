import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Audio",
      "Avatar",
      "Carousel",
      "Iframe",
      "ImageCropper",
      "Video",
      "VideoPropsProvider",
    ]);
  });

  it("exports Avatar as a namespace of its parts", () => {
    expect(Object.keys(barrel.Avatar).toSorted()).toStrictEqual([
      "Badge",
      "Fallback",
      "Group",
      "Image",
      "Root",
    ]);
  });
});
