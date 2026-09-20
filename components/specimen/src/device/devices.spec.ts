import { describe, expect, it } from "vitest";

import { type Size } from "@stealthscale/provider-viewport";

import { deviceOf, PHONE, widthsOf } from "#device/devices.ts";

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

describe("deviceOf", () => {
  it("gives a phone and a tablet their standing height", () => {
    expect(deviceOf(320, SIZES)).toStrictEqual({ height: 568, name: "phone", width: 320 });
    expect(deviceOf(768, SIZES)).toStrictEqual({ height: 1024, name: "md", width: 768 });
  });

  it("gives a width whose name it does not know a tablet's height", () => {
    expect(deviceOf(1000, SIZES)).toStrictEqual({ height: 1024, name: "desk", width: 1000 });
  });

  it("answers nothing for the window and for a width no size starts at", () => {
    expect(deviceOf(undefined, SIZES)).toBeUndefined();
    expect(deviceOf(700, SIZES)).toBeUndefined();
  });
});
