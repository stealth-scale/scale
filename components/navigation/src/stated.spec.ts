import { describe, expect, it } from "vitest";

import { stated } from "#stated.ts";

describe("stated", () => {
  it("keeps every setting a caller set", () => {
    expect(stated({ closeDelay: 0, openDelay: 500 })).toStrictEqual({
      closeDelay: 0,
      openDelay: 500,
    });
  });

  it("drops a setting a caller left unset", () => {
    expect(stated({ openDelay: undefined, orientation: "vertical" })).toStrictEqual({
      orientation: "vertical",
    });
  });

  it("keeps a setting a caller set to false", () => {
    expect(stated({ interactive: false })).toStrictEqual({ interactive: false });
  });

  it("keeps a setting a caller set to null", () => {
    expect(stated({ value: null })).toStrictEqual({ value: null });
  });

  it("answers nothing where a caller set nothing", () => {
    expect(stated({ openDelay: undefined })).toStrictEqual({});
  });

  it("answers nothing where it is given nothing", () => {
    expect(stated({})).toStrictEqual({});
  });
});
