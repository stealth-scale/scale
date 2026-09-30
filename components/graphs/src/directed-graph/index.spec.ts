import { describe, expect, it } from "vitest";

import * as directed from "#directed-graph/index.ts";

describe("index", () => {
  it("exports the directed graph and the functions it traces and hides nodes with", () => {
    expect(Object.keys(directed).toSorted()).toStrictEqual([
      "DirectedGraph",
      "descendantsOf",
      "hiddenBy",
      "relationOf",
      "traceGraph",
      "treeEdges",
    ]);
  });
});
