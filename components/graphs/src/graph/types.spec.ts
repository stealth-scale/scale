import { describe, expect, it } from "vitest";

import { Edge } from "#graph/edge.tsx";
import { LabelNode } from "#graph/label-node.tsx";
import { EDGE_TYPES, NODE_TYPES } from "#graph/types.ts";

describe("types", () => {
  it("maps React Flow's three built-in node types to the kit's node", () => {
    expect(NODE_TYPES).toStrictEqual({ default: LabelNode, input: LabelNode, output: LabelNode });
  });

  it("maps React Flow's default edge type to the kit's edge", () => {
    expect(EDGE_TYPES).toStrictEqual({ default: Edge });
  });
});
