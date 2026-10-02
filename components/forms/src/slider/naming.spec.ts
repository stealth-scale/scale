import { describe, expect, it } from "vitest";

import { naming } from "#slider/naming.ts";

describe("naming", () => {
  it("points the thumb at the group's name when it has no words of its own", () => {
    expect(naming(undefined, "label", "thumb")).toStrictEqual({ "aria-labelledby": "label" });
  });

  it("returns no attribute without words or a group's name", () => {
    expect(naming(undefined, undefined, "thumb")).toStrictEqual({});
  });

  it("points the thumb at the group's name and at itself when it has words", () => {
    expect(naming("Minimum", "label", "thumb")).toStrictEqual({
      "aria-label": "Minimum",
      "aria-labelledby": "label thumb",
    });
  });

  it("names the thumb by its words alone without a group's name", () => {
    expect(naming("Minimum", undefined, "thumb")).toStrictEqual({ "aria-label": "Minimum" });
  });
});
