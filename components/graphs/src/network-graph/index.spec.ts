import { describe, expect, it } from "vitest";

import * as network from "#network-graph/index.ts";

describe("index", () => {
  it("exports the network graph and the function it lights a focus's reach with", () => {
    expect(Object.keys(network).toSorted()).toStrictEqual(["NetworkGraph", "neighborsOf"]);
  });
});
