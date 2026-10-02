import { describe, expect, it } from "vitest";

import { treeEdges } from "#directed-graph/tree.ts";

const PEOPLE = [
  { id: "ceo", manager: undefined },
  { id: "cto", manager: "ceo" },
  { id: "platform", manager: "cto" },
  { id: "auditor", manager: "board" },
];

describe("treeEdges", () => {
  it("returns an edge from each item's parent to the item", () => {
    expect(
      treeEdges(PEOPLE, (person) => person.manager).map(({ source, target }) => [source, target]),
    ).toStrictEqual([
      ["ceo", "cto"],
      ["cto", "platform"],
    ]);
  });

  it("identifies each edge by its parent and its child", () => {
    expect(treeEdges(PEOPLE, (person) => person.manager)[0]?.id).toBe("ceo-cto");
  });

  it("leaves out an item without a parent", () => {
    expect(
      treeEdges(PEOPLE, (person) => person.manager).some((edge) => edge.target === "ceo"),
    ).toBe(false);
  });

  it("leaves out an item whose parent is not in the list", () => {
    expect(
      treeEdges(PEOPLE, (person) => person.manager).some((edge) => edge.target === "auditor"),
    ).toBe(false);
  });
});
