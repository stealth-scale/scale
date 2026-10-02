import { describe, expect, it } from "vitest";

import { arrangementOf } from "#form/arrangement.ts";

describe("arrangementOf", () => {
  it("returns a grid of the count of columns the group states", () => {
    expect(arrangementOf(3, undefined, false)).toStrictEqual({
      "data-columns": "",
      style: { "--form-columns": "3" },
    });
  });

  it("marks a grid crowded while its members do not fit", () => {
    expect(arrangementOf(2, "row", true)).toStrictEqual({
      "data-columns": "",
      "data-crowded": "",
      style: { "--form-columns": "2" },
    });
  });

  it("returns a row for a group without columns that runs across", () => {
    expect(arrangementOf(undefined, "row", true)).toStrictEqual({
      "data-direction": "row",
      style: {},
    });
  });

  it("returns a column for a group that states neither", () => {
    expect(arrangementOf(undefined, "column", false)).toStrictEqual({ style: {} });
  });
});
