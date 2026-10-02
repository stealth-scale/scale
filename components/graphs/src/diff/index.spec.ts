import { describe, expect, expectTypeOf, it } from "vitest";

import * as diff from "#diff/index.ts";

describe("index", () => {
  it("exports diffGraphs at run time", () => {
    expect(Object.keys(diff)).toStrictEqual(["diffGraphs"]);
  });

  it("exports the kinds of change", () => {
    expect(Object.keys(diff)).toHaveLength(1);

    expectTypeOf<diff.GraphChangeType>().toEqualTypeOf<
      "added" | "changed" | "removed" | "unchanged"
    >();
  });
});
