import { describe, expect, it } from "vitest";

import { PICTURES } from "#carousel/examples/pictures.ts";

describe("PICTURES", () => {
  it("lists the five pictures in the order the examples show them", () => {
    expect(PICTURES.map((picture) => picture.key)).toStrictEqual([
      "dawn",
      "lake",
      "dunes",
      "harbour",
      "peaks",
    ]);
  });

  it("gives every picture an address", () => {
    expect(PICTURES.every((picture) => picture.src !== "")).toBe(true);
  });
});
