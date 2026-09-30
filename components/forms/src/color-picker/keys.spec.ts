import { parseColor } from "@zag-js/color-utils";
import { describe, expect, it } from "vitest";

import { keyed } from "#color-picker/keys.ts";

/**
 * Blue at hue 200 in HSB, the color every case moves.
 */
const BLUE = parseColor("hsb(200, 50%, 50%)");

describe("keyed", () => {
  it.each([
    { key: "ArrowRight", rtl: false, shiftKey: false, want: 201 },
    { key: "ArrowUp", rtl: false, shiftKey: false, want: 201 },
    { key: "ArrowLeft", rtl: false, shiftKey: false, want: 199 },
    { key: "ArrowDown", rtl: false, shiftKey: false, want: 199 },
    { key: "ArrowRight", rtl: false, shiftKey: true, want: 210 },
    { key: "ArrowDown", rtl: false, shiftKey: true, want: 190 },
    { key: "PageUp", rtl: false, shiftKey: false, want: 210 },
    { key: "PageDown", rtl: false, shiftKey: false, want: 190 },
    { key: "Home", rtl: false, shiftKey: false, want: 0 },
    { key: "End", rtl: false, shiftKey: false, want: 360 },
    { key: "ArrowRight", rtl: true, shiftKey: false, want: 199 },
    { key: "ArrowLeft", rtl: true, shiftKey: false, want: 201 },
  ])(
    "moves the hue to $want on $key with shiftKey $shiftKey under rtl $rtl",
    ({ key, rtl, shiftKey, want }) => {
      expect(keyed({ key, shiftKey }, BLUE, "hue", rtl)?.getChannelValue("hue")).toBe(want);
    },
  );

  it("returns nothing for a key the thumb ignores", () => {
    expect(keyed({ key: "Enter", shiftKey: false }, BLUE, "hue", false)).toBeUndefined();
  });

  it("steps the alpha by its own step", () => {
    expect(
      keyed({ key: "ArrowLeft", shiftKey: false }, BLUE, "alpha", false)?.getChannelValue("alpha"),
    ).toBe(0.99);
  });
});
