import { describe, expect, it } from "vitest";

import * as examples from "#image-cropper/examples/index.ts";

describe("examples", () => {
  it("exports one namespace per example file", () => {
    expect(Object.keys(examples).toSorted()).toStrictEqual([
      "banner",
      "cover",
      "free",
      "photo",
      "profile",
    ]);
  });
});
