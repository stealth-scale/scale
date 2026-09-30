import { describe, expect, it } from "vitest";

import * as Format from "#format/index.ts";

describe("index", () => {
  it("exports the two formats", () => {
    expect(Object.keys(Format).toSorted()).toStrictEqual(["Byte", "Number"]);
  });
});
