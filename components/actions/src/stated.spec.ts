import { describe, expect, it } from "vitest";

import { stated } from "#stated.ts";

describe("stated", () => {
  it("keeps every setting a caller set", () => {
    expect(stated({ timeout: 250, value: "https://stealthscale.io" })).toStrictEqual({
      timeout: 250,
      value: "https://stealthscale.io",
    });
  });

  it("drops a setting a caller left unset", () => {
    expect(stated({ timeout: undefined, value: "https://stealthscale.io" })).toStrictEqual({
      value: "https://stealthscale.io",
    });
  });

  it("keeps a setting a caller set to false", () => {
    expect(stated({ interactive: false })).toStrictEqual({ interactive: false });
  });

  it("keeps a setting a caller set to null", () => {
    expect(stated({ value: null })).toStrictEqual({ value: null });
  });

  it("returns nothing where a caller set nothing", () => {
    expect(stated({ timeout: undefined })).toStrictEqual({});
  });

  it("returns nothing where it is given nothing", () => {
    expect(stated({})).toStrictEqual({});
  });
});
