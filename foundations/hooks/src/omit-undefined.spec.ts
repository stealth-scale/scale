import { describe, expect, it } from "vitest";

import { omitUndefined } from "#omit-undefined.ts";

describe("omitUndefined", () => {
  it("returns every entry when no value is undefined", () => {
    expect(omitUndefined({ closeDelay: 0, openDelay: 500 })).toStrictEqual({
      closeDelay: 0,
      openDelay: 500,
    });
  });

  it("drops an entry whose value is undefined", () => {
    expect(omitUndefined({ openDelay: undefined, orientation: "vertical" })).toStrictEqual({
      orientation: "vertical",
    });
  });

  it("keeps an entry whose value is false", () => {
    expect(omitUndefined({ interactive: false })).toStrictEqual({ interactive: false });
  });

  it("keeps an entry whose value is null", () => {
    expect(omitUndefined({ value: null })).toStrictEqual({ value: null });
  });

  it("returns an empty object when every value is undefined", () => {
    expect(omitUndefined({ checked: undefined, name: undefined })).toStrictEqual({});
  });

  it("returns an empty object for an empty input", () => {
    expect(omitUndefined({})).toStrictEqual({});
  });

  it("leaves the input object unchanged", () => {
    const options = { openDelay: undefined, orientation: "vertical" };

    omitUndefined(options);

    expect(options).toStrictEqual({ openDelay: undefined, orientation: "vertical" });
  });
});
