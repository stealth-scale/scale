import { describe, expect, it } from "vitest";

import { rounded } from "#image-cropper/rounded.ts";

describe("rounded", () => {
  it("rounds each value to a whole pixel", () => {
    expect(rounded({ height: 255.5, width: 383.4, x: 47.6, y: 32.2 })).toStrictEqual({
      height: 256,
      width: 383,
      x: 48,
      y: 32,
    });
  });
});
