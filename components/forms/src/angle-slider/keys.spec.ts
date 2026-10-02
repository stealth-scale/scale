import { describe, expect, it } from "vitest";

import { keyEvent } from "#angle-slider/keys.ts";

describe("keyEvent", () => {
  it.each([
    { key: "ArrowRight", type: "THUMB.ARROW_INC" },
    { key: "ArrowUp", type: "THUMB.ARROW_INC" },
    { key: "ArrowLeft", type: "THUMB.ARROW_DEC" },
    { key: "ArrowDown", type: "THUMB.ARROW_DEC" },
  ])("sends $type by one step for $key", ({ key, type }) => {
    expect(keyEvent({ key, shiftKey: false }, 5, "ltr")).toStrictEqual({ step: 5, type });
  });

  it.each([
    { key: "PageUp", type: "THUMB.ARROW_INC" },
    { key: "PageDown", type: "THUMB.ARROW_DEC" },
  ])("sends $type by ten steps for $key", ({ key, type }) => {
    expect(keyEvent({ key, shiftKey: false }, 5, "ltr")).toStrictEqual({ step: 50, type });
  });

  it("steps ten times as far for an arrow with Shift", () => {
    expect(keyEvent({ key: "ArrowUp", shiftKey: true }, 1, "ltr")).toStrictEqual({
      step: 10,
      type: "THUMB.ARROW_INC",
    });
  });

  it("steps the value up on ArrowLeft under rtl", () => {
    expect(keyEvent({ key: "ArrowLeft", shiftKey: false }, 1, "rtl")).toStrictEqual({
      step: 1,
      type: "THUMB.ARROW_INC",
    });
  });

  it("keeps ArrowUp stepping the value up under rtl", () => {
    expect(keyEvent({ key: "ArrowUp", shiftKey: false }, 1, "rtl")).toStrictEqual({
      step: 1,
      type: "THUMB.ARROW_INC",
    });
  });

  it.each([
    { key: "Home", type: "THUMB.HOME" },
    { key: "End", type: "THUMB.END" },
  ])("sends $type for $key", ({ key, type }) => {
    expect(keyEvent({ key, shiftKey: false }, 1, "ltr")).toStrictEqual({ type });
  });

  it("returns nothing for a key the thumb leaves alone", () => {
    expect(keyEvent({ key: "Enter", shiftKey: false }, 1, "ltr")).toBeUndefined();
  });
});
