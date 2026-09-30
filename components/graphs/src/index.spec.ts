import { describe, expect, it } from "vitest";

import * as graphs from "#index.ts";

describe("index", () => {
  it("exports the Graph namespace beside the presets and their functions at run time", () => {
    expect(Object.keys(graphs).toSorted()).toStrictEqual([
      "DirectedGraph",
      "Graph",
      "NetworkGraph",
      "descendantsOf",
      "diffGraphs",
      "hiddenBy",
      "layoutForce",
      "layoutGraph",
      "neighborsOf",
      "relationOf",
      "traceGraph",
      "treeEdges",
    ]);
  });
});
