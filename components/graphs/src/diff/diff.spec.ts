import { createElement } from "react";

import { type Edge, type Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { diffGraphs, type GraphChange, type GraphVersion } from "#diff/diff.ts";

const AT = { x: 0, y: 0 };

const BEFORE: GraphVersion = {
  edges: [
    { id: "e1", source: "guard", target: "draft" },
    { id: "e2", source: "draft", target: "publish" },
  ],
  nodes: [
    { data: { label: "Screen the request", mode: "block" }, id: "guard", position: AT },
    { data: { label: "Draft the answer", model: "sonnet" }, id: "draft", position: AT },
    { data: { label: "Publish" }, id: "publish", position: AT },
  ],
};

const AFTER: GraphVersion = {
  edges: [
    { id: "e1", source: "guard", target: "draft" },
    { id: "e3", source: "draft", target: "judge" },
    { id: "e4", source: "judge", target: "publish" },
  ],
  nodes: [
    { data: { label: "Screen the request", mode: "block" }, id: "guard", position: { x: 9, y: 9 } },
    { data: { label: "Draft the answer", model: "opus" }, id: "draft", position: AT },
    { data: { label: "Score the drafts" }, id: "judge", position: AT },
    { data: { label: "Publish" }, id: "publish", position: AT },
  ],
};

function nodeOf(data: Node["data"]): GraphVersion {
  return { edges: [], nodes: [{ data, id: "step", position: AT }] };
}

function edgesOf(...edges: Edge[]): GraphVersion {
  return { edges, nodes: AFTER.nodes };
}

function changeOf(entries: readonly GraphChange[], id: string): GraphChange | undefined {
  return entries.find((entry) => entry.id === id);
}

describe("diff", () => {
  it("marks a node only the later version has as added", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).nodes, "judge")?.change).toBe("added");
  });

  it("marks a node only the earlier version has as removed", () => {
    expect(changeOf(diffGraphs(AFTER, BEFORE).nodes, "judge")?.change).toBe("removed");
  });

  it("marks a node whose data differs as changed", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).nodes, "draft")?.change).toBe("changed");
  });

  it("names the fields of a changed node's data that differ in order", () => {
    const before = nodeOf({ label: "Draft", model: "sonnet", tone: "plain" });
    const after = nodeOf({ label: "Draft", model: "opus", tone: "formal" });

    expect(changeOf(diffGraphs(before, after).nodes, "step")?.fields).toStrictEqual([
      "model",
      "tone",
    ]);
  });

  it("marks a node that only moved as unchanged", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).nodes, "guard")?.change).toBe("unchanged");
  });

  it("marks a node whose data lists its keys in another order as unchanged", () => {
    const before = nodeOf({ label: "Draft", limits: { tokens: 800, turns: 3 } });
    const after = nodeOf({ label: "Draft", limits: { tokens: 800, turns: 3 } });

    expect(changeOf(diffGraphs(before, after).nodes, "step")?.change).toBe("unchanged");
  });

  it("names a field one version's data lacks", () => {
    const after = nodeOf({ label: "Draft", retries: 2 });

    expect(
      changeOf(diffGraphs(nodeOf({ label: "Draft" }), after).nodes, "step")?.fields,
    ).toStrictEqual(["retries"]);
  });

  it("marks a node whose data has another component as changed", () => {
    const before = nodeOf({ icon: createElement("svg"), label: "Draft" });
    const after = nodeOf({ icon: createElement("img"), label: "Draft" });

    expect(changeOf(diffGraphs(before, after).nodes, "step")?.fields).toStrictEqual(["icon"]);
  });

  it("marks a node whose data has the same component with other props as changed", () => {
    const before = nodeOf({ icon: createElement("svg", { "data-kind": "model" }), label: "Draft" });
    const after = nodeOf({ icon: createElement("svg", { "data-kind": "tool" }), label: "Draft" });

    expect(changeOf(diffGraphs(before, after).nodes, "step")?.change).toBe("changed");
  });

  it("marks a node whose data has the same component with the same props as unchanged", () => {
    const before = nodeOf({ icon: createElement("svg", { "data-kind": "model" }), label: "Draft" });
    const after = nodeOf({ icon: createElement("svg", { "data-kind": "model" }), label: "Draft" });

    expect(changeOf(diffGraphs(before, after).nodes, "step")?.change).toBe("unchanged");
  });

  it("names a node by its data's label", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).nodes, "judge")?.label).toBe("Score the drafts");
  });

  it("names a node without a string label by its id", () => {
    expect(changeOf(diffGraphs(nodeOf({}), nodeOf({})).nodes, "step")?.label).toBe("step");
  });

  it("lists the later version's nodes in order and the removed nodes after them", () => {
    expect(diffGraphs(AFTER, BEFORE).nodes.map(({ id }) => id)).toStrictEqual([
      "guard",
      "draft",
      "publish",
      "judge",
    ]);
  });

  it("marks an edge only the later version has as added", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).edges, "e3")?.change).toBe("added");
  });

  it("marks an edge only the earlier version has as removed", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).edges, "e2")?.change).toBe("removed");
  });

  it("marks an edge between the same ports as unchanged under the later version's id", () => {
    const before = edgesOf({ id: "old", source: "guard", target: "draft" });
    const after = edgesOf({ id: "new", source: "guard", target: "draft" });

    expect(diffGraphs(before, after).edges).toStrictEqual([
      {
        change: "unchanged",
        fields: [],
        id: "new",
        label: "Screen the request to Draft the answer",
      },
    ]);
  });

  it("marks an edge that leaves another port as another edge", () => {
    const before = edgesOf({ id: "e", source: "draft", sourceHandle: "text", target: "judge" });
    const after = edgesOf({ id: "e", source: "draft", sourceHandle: "json", target: "judge" });

    expect(diffGraphs(before, after).edges.map(({ change }) => change)).toStrictEqual([
      "added",
      "removed",
    ]);
  });

  it("marks an edge that enters another port as another edge", () => {
    const before = edgesOf({ id: "e", source: "draft", target: "judge", targetHandle: "a" });
    const after = edgesOf({ id: "e", source: "draft", target: "judge", targetHandle: "b" });

    expect(diffGraphs(before, after).edges.map(({ change }) => change)).toStrictEqual([
      "added",
      "removed",
    ]);
  });

  it("names a removed edge from the names of its ends in the earlier version", () => {
    expect(changeOf(diffGraphs(BEFORE, AFTER).edges, "e2")?.label).toBe(
      "Draft the answer to Publish",
    );
  });

  it("names an edge end that is no node of its version by its id", () => {
    const after = edgesOf({ id: "e", source: "ghost", target: "judge" });

    expect(changeOf(diffGraphs(edgesOf(), after).edges, "e")?.label).toBe(
      "ghost to Score the drafts",
    );
  });

  it("names an edge target that is no node of its version by its id", () => {
    const after = edgesOf({ id: "e", source: "judge", target: "ghost" });

    expect(changeOf(diffGraphs(edgesOf(), after).edges, "e")?.label).toBe(
      "Score the drafts to ghost",
    );
  });

  it("names an edge through edgeName", () => {
    const named = diffGraphs(BEFORE, AFTER, ({ source, target }) => `${source} → ${target}`);

    expect(changeOf(named.edges, "e3")?.label).toBe("Draft the answer → Score the drafts");
  });

  it("gives an edge no fields", () => {
    expect(diffGraphs(BEFORE, AFTER).edges.flatMap(({ fields }) => fields)).toStrictEqual([]);
  });
});
