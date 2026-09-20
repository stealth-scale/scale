import { describe, expect, it } from "vitest";

import { type Size } from "@stealthscale/provider-viewport";

import { PHONE, stageWidthOf, widthsOf } from "#stage/width.ts";

const SIZES: readonly Size[] = [
  { min: 640, name: "sm" },
  { min: 768, name: "md" },
  { min: 1000, name: "desk" },
];

describe("widthsOf", () => {
  it("lists the phone before the theme's breakpoints", () => {
    expect(widthsOf(SIZES).map((size) => size.name)).toStrictEqual(["phone", "sm", "md", "desk"]);
  });

  it("names the phone at the smallest measure", () => {
    expect(PHONE).toStrictEqual({ min: 320, name: "phone" });
  });
});

describe("stageWidthOf", () => {
  it("names the width a size starts at", () => {
    expect(stageWidthOf(320, SIZES)).toBe("phone");
    expect(stageWidthOf(768, SIZES)).toBe("md");
  });

  it("answers nothing for the window", () => {
    expect(stageWidthOf(undefined, SIZES)).toBeUndefined();
  });

  it("answers nothing for a width no size starts at and for one the stage does not know", () => {
    expect(stageWidthOf(700, SIZES)).toBeUndefined();
    expect(stageWidthOf(1000, SIZES)).toBeUndefined();
  });
});
