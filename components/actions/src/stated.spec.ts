import { describe, expect, it } from "vitest";

import { stated } from "#stated.ts";

describe("stated", () => {
  it("returns every entry when no value is undefined", () => {
    expect(stated({ timeout: 250, value: "https://stealthscale.io" })).toStrictEqual({
      timeout: 250,
      value: "https://stealthscale.io",
    });
  });

  it("drops the entry whose value is undefined", () => {
    expect(stated({ timeout: undefined, value: "https://stealthscale.io" })).toStrictEqual({
      value: "https://stealthscale.io",
    });
  });

  it("keeps an entry whose value is false", () => {
    expect(stated({ interactive: false })).toStrictEqual({ interactive: false });
  });

  it("keeps an entry whose value is null", () => {
    expect(stated({ value: null })).toStrictEqual({ value: null });
  });

  it("returns an empty object when every value is undefined", () => {
    expect(stated({ timeout: undefined })).toStrictEqual({});
  });

  it("returns an empty object for an empty input", () => {
    expect(stated({})).toStrictEqual({});
  });
});
