import { describe, expect, it } from "vitest";

import * as Graph from "#graph/index.ts";

describe("index", () => {
  it("exports the kit's parts", () => {
    expect(Object.keys(Graph).toSorted()).toStrictEqual([
      "Canvas",
      "Caption",
      "Control",
      "Controls",
      "Edge",
      "Empty",
      "LabelNode",
      "MiniMap",
      "Node",
      "PaletteItem",
      "Root",
      "Summary",
      "ZoomLevel",
      "edgeTypes",
      "nodeTypes",
      "useGraphDirection",
    ]);
  });
});
