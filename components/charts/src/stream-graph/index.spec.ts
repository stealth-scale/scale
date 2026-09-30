import { describe, expect, it } from "vitest";

import * as streamGraph from "#stream-graph/index.ts";

describe("index", () => {
  it("exports StreamGraph with the functions that order its series", () => {
    expect(Object.keys(streamGraph).toSorted()).toStrictEqual([
      "StreamGraph",
      "insideOutOrder",
      "streamOnset",
    ]);
  });
});
