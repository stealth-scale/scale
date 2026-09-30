import { describe, expect, it } from "vitest";

import * as heat from "#heat/index.ts";

describe("index", () => {
  it("exports heatmapDomain as its one runtime name", () => {
    expect(Object.keys(heat)).toStrictEqual(["heatmapDomain"]);
  });
});
