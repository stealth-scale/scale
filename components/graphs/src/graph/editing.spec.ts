import { renderHook } from "@testing-library/react";
import { type Edge, type Node, ReactFlowProvider, type XYPosition } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

import { editingOf, type GraphEdit, type GraphStep, useEdits } from "#graph/editing.ts";

const AT = { x: 0, y: 0 };

const DRAFT: Node = { data: { label: "Draft" }, id: "draft", position: AT };

const JUDGE: Node = { data: { label: "Judge" }, id: "judge", position: { x: 0, y: 120 } };

const PUBLISH: Node = { data: { label: "Publish" }, id: "publish", position: { x: 0, y: 240 } };

const NODES: Node[] = [DRAFT, JUDGE, PUBLISH];

const EDGES: Edge[] = [{ id: "draft-judge", source: "draft", target: "judge" }];

type Reported = [GraphEdit<Node, Edge>, GraphStep];

type OnGraphChange = (graph: GraphEdit<Node, Edge>, step: GraphStep) => void;

type OnDropItem = (item: string, position: XYPosition) => void;

function editing(): { edits: ReturnType<typeof editingOf>; reported: Reported[] } {
  const reported: Reported[] = [];
  const edits = editingOf({
    edges: EDGES,
    nodes: NODES,
    onGraphChange: (graph, step) => {
      reported.push([graph, step]);
    },
  });

  return { edits, reported };
}

describe("editing", () => {
  it("reports a connection with the edge it adds", () => {
    const { edits, reported } = editing();

    edits.onConnect({ source: "judge", sourceHandle: null, target: "publish", targetHandle: null });

    expect(reported[0]?.[1]).toStrictEqual({
      edges: ["xy-edge__judge-publish"],
      nodes: [],
      type: "connect",
    });
  });

  it("reports the graph with the connection's edge after the graph's own", () => {
    const { edits, reported } = editing();

    edits.onConnect({ source: "judge", sourceHandle: null, target: "publish", targetHandle: null });

    expect(reported[0]?.[0].edges.map(({ id }) => id)).toStrictEqual([
      "draft-judge",
      "xy-edge__judge-publish",
    ]);
  });

  it("reports no connection that repeats an edge", () => {
    const { edits, reported } = editing();

    edits.onConnect({ source: "draft", sourceHandle: null, target: "judge", targetHandle: null });

    expect(reported).toStrictEqual([]);
  });

  it("calls the caller's onConnect first", () => {
    const onConnect = vi.fn<(connection: unknown) => void>();
    const onGraphChange = vi.fn<OnGraphChange>();
    const edits = editingOf({ edges: EDGES, nodes: NODES, onConnect, onGraphChange });
    const connection = {
      source: "judge",
      sourceHandle: null,
      target: "publish",
      targetHandle: null,
    };

    edits.onConnect(connection);

    expect(onConnect.mock.lastCall).toStrictEqual([connection]);
  });

  it("reports a removal with every node and edge it removed", () => {
    const { edits, reported } = editing();

    edits.onDelete({ edges: EDGES, nodes: [JUDGE] });

    expect(reported[0]?.[1]).toStrictEqual({
      edges: ["draft-judge"],
      nodes: ["judge"],
      type: "remove",
    });
  });

  it("reports the graph without what a removal removed", () => {
    const { edits, reported } = editing();

    edits.onDelete({ edges: EDGES, nodes: [JUDGE] });

    expect(reported[0]?.[0]).toStrictEqual({ edges: [], nodes: [DRAFT, PUBLISH] });
  });

  it("calls the caller's onDelete first", () => {
    const onDelete = vi.fn<(removed: unknown) => void>();
    const onGraphChange = vi.fn<OnGraphChange>();
    const edits = editingOf({ edges: EDGES, nodes: NODES, onDelete, onGraphChange });

    edits.onDelete({ edges: [], nodes: [] });

    expect(onDelete.mock.lastCall).toStrictEqual([{ edges: [], nodes: [] }]);
  });

  it("reports a move that ends with the nodes it moved", () => {
    const { edits, reported } = editing();

    edits.onNodesChange([
      { dragging: false, id: "judge", position: { x: 40, y: 120 }, type: "position" },
    ]);

    expect(reported[0]?.[1]).toStrictEqual({ edges: [], nodes: ["judge"], type: "move" });
  });

  it("reports the graph with each moved node where the move ended", () => {
    const { edits, reported } = editing();

    edits.onNodesChange([
      { dragging: false, id: "judge", position: { x: 40, y: 120 }, type: "position" },
    ]);

    expect(reported[0]?.[0].nodes.map(({ position }) => position)).toStrictEqual([
      AT,
      { x: 40, y: 120 },
      { x: 0, y: 240 },
    ]);
  });

  it("reports no move while a drag continues", () => {
    const { edits, reported } = editing();

    edits.onNodesChange([
      { dragging: true, id: "judge", position: { x: 40, y: 120 }, type: "position" },
    ]);

    expect(reported).toStrictEqual([]);
  });

  it("reports no selection and no measurement as an edit", () => {
    const { edits, reported } = editing();

    edits.onNodesChange([
      { id: "judge", selected: true, type: "select" },
      { dimensions: { height: 52, width: 256 }, id: "judge", type: "dimensions" },
    ]);

    expect(reported).toStrictEqual([]);
  });

  it("calls the caller's onNodesChange first", () => {
    const onNodesChange = vi.fn<(changes: unknown) => void>();
    const onGraphChange = vi.fn<OnGraphChange>();
    const edits = editingOf({ edges: EDGES, nodes: NODES, onGraphChange, onNodesChange });
    const changes = [{ id: "judge", selected: true, type: "select" as const }];

    edits.onNodesChange(changes);

    expect(onNodesChange.mock.lastCall).toStrictEqual([changes]);
  });

  it("returns only the drop target without onGraphChange", () => {
    const onDropItem = vi.fn<OnDropItem>();
    const { result } = renderHook(() => useEdits({ onDropItem }), { wrapper: ReactFlowProvider });

    expect(Object.keys(result.current).toSorted()).toStrictEqual(["onDragOver", "onDrop"]);
  });

  it("returns the edit handlers with onGraphChange", () => {
    const onGraphChange = vi.fn<OnGraphChange>();
    const { result } = renderHook(() => useEdits({ onGraphChange }), {
      wrapper: ReactFlowProvider,
    });

    expect(Object.keys(result.current).toSorted()).toStrictEqual([
      "onConnect",
      "onDelete",
      "onNodesChange",
    ]);
  });

  it("reports an edit to a graph without nodes or edges as an empty graph", () => {
    const onGraphChange = vi.fn<(graph: GraphEdit<Node, Edge>, step: GraphStep) => void>();
    const { result } = renderHook(() => useEdits({ onGraphChange }), {
      wrapper: ReactFlowProvider,
    });

    result.current.onDelete?.({ edges: [], nodes: [] });

    expect(onGraphChange.mock.lastCall?.[0]).toStrictEqual({ edges: [], nodes: [] });
  });
});
