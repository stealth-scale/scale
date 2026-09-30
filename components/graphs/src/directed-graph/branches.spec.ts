import { describe, expect, it } from "vitest";

import { descendantsOf, hiddenBy } from "#directed-graph/branches.ts";

const TREE = [
  { source: "ceo", target: "cto" },
  { source: "ceo", target: "cfo" },
  { source: "cto", target: "platform" },
  { source: "platform", target: "infra" },
];

const PEOPLE = ["ceo", "cto", "cfo", "platform", "infra"];

function sorted(ids: ReadonlySet<string>): string[] {
  return [...ids].toSorted();
}

describe("branches", () => {
  it("returns every node a node leads to", () => {
    expect(sorted(descendantsOf(TREE, "ceo"))).toStrictEqual(["cfo", "cto", "infra", "platform"]);
  });

  it("leaves the node out of the nodes a cycle leads it back to", () => {
    const cycle = [
      { source: "a", target: "b" },
      { source: "b", target: "a" },
    ];

    expect(sorted(descendantsOf(cycle, "a"))).toStrictEqual(["b"]);
  });

  it("hides nothing while no node is collapsed", () => {
    expect(sorted(hiddenBy(PEOPLE, TREE, new Set()))).toStrictEqual([]);
  });

  it("hides every node a collapsed node leads to", () => {
    expect(sorted(hiddenBy(PEOPLE, TREE, new Set(["cto"])))).toStrictEqual(["infra", "platform"]);
  });

  it("keeps a node another parent leads to", () => {
    const shared = [...TREE, { source: "cfo", target: "platform" }];

    expect(sorted(hiddenBy(PEOPLE, shared, new Set(["cto"])))).toStrictEqual([]);
  });

  it("hides a cycle that only a collapsed node leads to", () => {
    const links = [
      { source: "root", target: "a" },
      { source: "a", target: "b" },
      { source: "b", target: "a" },
    ];

    expect(sorted(hiddenBy(["root", "a", "b"], links, new Set(["root"])))).toStrictEqual([
      "a",
      "b",
    ]);
  });

  it("shows a cycle that no root leads to", () => {
    const links = [
      { source: "a", target: "b" },
      { source: "b", target: "a" },
    ];

    expect(sorted(hiddenBy(["a", "b"], links, new Set(["a"])))).toStrictEqual([]);
  });

  it("treats a node that only a link from outside the graph enters as a root", () => {
    const links = [...TREE, { source: "board", target: "ceo" }];

    expect(sorted(hiddenBy(PEOPLE, links, new Set(["cto"])))).toStrictEqual(["infra", "platform"]);
  });
});
