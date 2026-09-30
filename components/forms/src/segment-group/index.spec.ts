import { describe, expect, it } from "vitest";

import * as SegmentGroup from "#segment-group/index.ts";

describe("index", () => {
  it("exports the three parts by their short names", () => {
    expect(Object.keys(SegmentGroup).toSorted()).toStrictEqual(["Item", "ItemText", "Root"]);
  });
});
