import { describe, expect, it } from "vitest";

import * as barrel from "#progress/index.ts";

describe("index", () => {
  it("exports the seven parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Label",
      "Marker",
      "Range",
      "Root",
      "Segment",
      "Track",
      "ValueText",
    ]);
  });
});
