import { describe, expect, it } from "vitest";

import { EDGES, NODES } from "#directed-graph/directed-graph.fixtures.tsx";
import { type CardNode, type View, type ViewInput, viewOf } from "#directed-graph/view.ts";
import { WORDS } from "#directed-graph/words.ts";

const SIZE = { height: 52, width: 256 };

const MEASURED = new Map(NODES.map((node) => [node.id, SIZE]));

function viewed(input: Partial<ViewInput> = {}): View {
  return viewOf({
    collapsed: new Set(),
    collapsible: false,
    depth: Number.POSITIVE_INFINITY,
    direction: "down",
    edges: EDGES,
    focus: null,
    nodes: NODES,
    sizes: MEASURED,
    trace: "highlight",
    words: WORDS,
    ...input,
  });
}

function card(view: View, id: string): CardNode {
  const found = view.nodes.find((node) => node.id === id);

  if (found === undefined) throw new Error(`No card renders ${id}.`);

  return found;
}

function idsOf(view: View): string[] {
  return view.nodes.map((node) => node.id);
}

function traceOf(view: View, id: string): unknown {
  return view.edges.find((edge) => edge.id === id)?.domAttributes;
}

function positionsOf(view: View): unknown {
  return view.nodes.map((node) => node.position);
}

describe("view", () => {
  it("renders every node at the origin until React Flow has measured every node", () => {
    const view = viewed({ sizes: new Map([["orders", SIZE]]) });

    expect(view.nodes.map((node) => node.position)).toStrictEqual(
      NODES.map(() => ({ x: 0, y: 0 })),
    );
  });

  it("reports the view incomplete while a node is unmeasured", () => {
    expect(viewed({ sizes: new Map([["orders", SIZE]]) }).complete).toBe(false);
  });

  it("reports the view complete once every node is measured", () => {
    expect(viewed().complete).toBe(true);
  });

  it("passes a measured node's size to React Flow", () => {
    expect(card(viewed({ sizes: new Map([["orders", SIZE]]) }), "orders").measured).toStrictEqual(
      SIZE,
    );
  });

  it("passes no size for a node React Flow has not measured", () => {
    expect(card(viewed({ sizes: new Map([["orders", SIZE]]) }), "clean").measured).toBeUndefined();
  });

  it("renders every node while React Flow has not measured every node", () => {
    const view = viewed({
      collapsed: new Set(["joined"]),
      collapsible: true,
      sizes: new Map(),
    });

    expect(idsOf(view)).toStrictEqual(NODES.map((node) => node.id));
  });

  it("places each node a rank below the node it reads while the graph runs down", () => {
    const view = viewed();

    expect(["orders", "clean", "joined"].map((id) => card(view, id).position.y)).toStrictEqual([
      0, 180, 360,
    ]);
  });

  it("places each node a rank after the node it reads while the graph runs right", () => {
    const view = viewed({ direction: "right" });

    expect(["orders", "clean", "joined"].map((id) => card(view, id).position.x)).toStrictEqual([
      0, 384, 768,
    ]);
  });

  it("keeps every position when a node takes the focus", () => {
    expect(positionsOf(viewed({ focus: "joined" }))).toStrictEqual(positionsOf(viewed()));
  });

  it("renders every node while nothing is focused", () => {
    expect(idsOf(viewed())).toHaveLength(NODES.length);
  });

  it("renders the focused node and the nodes it traced alone while the trace isolates", () => {
    expect(idsOf(viewed({ focus: "joined", trace: "isolate" }))).toStrictEqual([
      "orders",
      "customers",
      "clean",
      "joined",
      "revenue",
      "churn",
    ]);
  });

  it("renders every node while the trace isolates and nothing is focused", () => {
    expect(idsOf(viewed({ trace: "isolate" }))).toHaveLength(NODES.length);
  });

  it("follows depth hops each way", () => {
    expect(idsOf(viewed({ depth: 1, focus: "joined", trace: "isolate" }))).toStrictEqual([
      "customers",
      "clean",
      "joined",
      "revenue",
      "churn",
    ]);
  });

  it("hides the nodes a closed branch leads to", () => {
    const view = viewed({ collapsed: new Set(["joined"]), collapsible: true });

    expect(idsOf(view)).toStrictEqual([
      "orders",
      "customers",
      "clean",
      "joined",
      "logs",
      "traffic",
    ]);
  });

  it("closes no branch while the graph is not collapsible", () => {
    expect(idsOf(viewed({ collapsed: new Set(["joined"]) }))).toHaveLength(NODES.length);
  });

  it("types every node as the directed graph's card", () => {
    expect(new Set(viewed().nodes.map((node) => node.type))).toStrictEqual(new Set(["directed"]));
  });

  it("selects the focused node alone", () => {
    const view = viewed({ focus: "joined" });

    expect(
      view.nodes.filter((node) => node.selected === true).map((node) => node.id),
    ).toStrictEqual(["joined"]);
  });

  it.each([
    { id: "joined", tag: "Focus" },
    { id: "clean", tag: "Upstream" },
    { id: "orders", tag: "Upstream" },
    { id: "revenue", tag: "Downstream" },
    { id: "logs", tag: undefined },
  ])("tags $id with $tag while joined is focused", ({ id, tag }) => {
    expect(card(viewed({ focus: "joined" }), id).data.tag).toBe(tag);
  });

  it("tags no node while nothing is focused", () => {
    expect(viewed().nodes.filter((node) => node.data.tag !== undefined)).toStrictEqual([]);
  });

  it("tags no node while the trace is off", () => {
    const view = viewed({ focus: "joined", trace: "off" });

    expect(view.nodes.filter((node) => node.data.tag !== undefined)).toStrictEqual([]);
  });

  it("ends a related node's accessible name with its relation", () => {
    expect(card(viewed({ focus: "joined" }), "clean").ariaLabel).toBe("Clean orders, Upstream");
  });

  it("names an unrelated node by its label", () => {
    expect(card(viewed({ focus: "joined" }), "logs").ariaLabel).toBe("Web logs");
  });

  it("dims an unrelated node while the trace highlights", () => {
    expect(card(viewed({ focus: "joined" }), "logs").data.dimmed).toBe(true);
  });

  it("dims no related node", () => {
    expect(card(viewed({ focus: "joined" }), "clean").data.dimmed).toBe(false);
  });

  it("dims no node while the trace is off", () => {
    expect(card(viewed({ focus: "joined", trace: "off" }), "logs").data.dimmed).toBe(false);
  });

  it("gives a node a used input port while a shown edge enters it", () => {
    expect(card(viewed(), "clean").data.inputs).toStrictEqual([
      { id: "in", label: "Upstream", unused: false },
    ]);
  });

  it("marks a node's input port unused while no edge enters it", () => {
    expect(card(viewed(), "orders").data.inputs).toStrictEqual([
      { id: "in", label: "Upstream", unused: true },
    ]);
  });

  it("gives a node a used output port while a shown edge leaves it", () => {
    expect(card(viewed(), "orders").data.outputs).toStrictEqual([
      { id: "out", label: "Downstream", unused: false },
    ]);
  });

  it("marks a node's output port unused while its branch is closed", () => {
    const view = viewed({ collapsed: new Set(["joined"]), collapsible: true });

    expect(card(view, "joined").data.outputs).toStrictEqual([
      { id: "out", label: "Downstream", unused: true },
    ]);
  });

  it("passes the node's own fields to its card", () => {
    const status = { label: "Stale", palette: "warning" } as const;
    const view = viewed({
      nodes: [
        { detail: "12 rows", icon: "#", id: "orders", kind: "Table", label: "Orders", status },
      ],
    });

    expect(card(view, "orders").data).toMatchObject({
      detail: "12 rows",
      icon: "#",
      kind: "Table",
      label: "Orders",
      status,
    });
  });

  it("renders only the edges whose ends both show", () => {
    const view = viewed({ focus: "joined", trace: "isolate" });

    expect(view.edges.map((edge) => edge.id)).not.toContain("logs-traffic");
  });

  it("gives an edge without an id its ends' ids joined by a hyphen", () => {
    expect(viewed().edges[0]?.id).toBe("orders-clean");
  });

  it("keeps an edge's own id", () => {
    const view = viewed({ edges: [{ id: "reads", source: "orders", target: "clean" }] });

    expect(view.edges[0]?.id).toBe("reads");
  });

  it("names an edge by the names of its ends", () => {
    expect(viewed().edges[0]?.ariaLabel).toBe("Orders to Clean orders");
  });

  it("renders no edge whose end is not a node of the graph", () => {
    expect(viewed({ edges: [{ source: "orders", target: "ghost" }] }).edges).toStrictEqual([]);
  });

  it("renders no edge whose start is not a node of the graph", () => {
    expect(viewed({ edges: [{ source: "ghost", target: "orders" }] }).edges).toStrictEqual([]);
  });

  it("makes every edge unselectable", () => {
    expect(new Set(viewed().edges.map((edge) => edge.selectable))).toStrictEqual(new Set([false]));
  });

  it("marks an edge between related nodes on the traced path", () => {
    expect(traceOf(viewed({ focus: "joined" }), "orders-clean")).toStrictEqual({
      "data-trace": "on",
    });
  });

  it("marks an edge with an unrelated end off the traced path", () => {
    expect(traceOf(viewed({ focus: "joined" }), "logs-traffic")).toStrictEqual({
      "data-trace": "off",
    });
  });

  it("marks an edge with one related end off the traced path", () => {
    expect(traceOf(viewed({ depth: 1, focus: "joined" }), "orders-clean")).toStrictEqual({
      "data-trace": "off",
    });
  });

  it("marks no edge while nothing is focused", () => {
    expect(traceOf(viewed(), "orders-clean")).toBeUndefined();
  });

  it("marks no edge while the trace is off", () => {
    expect(traceOf(viewed({ focus: "joined", trace: "off" }), "orders-clean")).toBeUndefined();
  });

  it("gives an open branch a control with the number of nodes a press hides", () => {
    expect(card(viewed({ collapsible: true }), "joined").data.branch).toStrictEqual({
      expanded: true,
      label: "Hide 2",
    });
  });

  it("gives a closed branch a control with the number of nodes a press shows", () => {
    const view = viewed({ collapsed: new Set(["joined"]), collapsible: true });

    expect(card(view, "joined").data.branch).toStrictEqual({ expanded: false, label: "Show 2" });
  });

  it("gives a leaf no branch control", () => {
    expect(card(viewed({ collapsible: true }), "revenue").data.branch).toBeUndefined();
  });

  it("gives no branch control while another parent leads to every node a press would hide", () => {
    expect(card(viewed({ collapsible: true }), "customers").data.branch).toBeUndefined();
  });

  it("gives no branch control while the graph is not collapsible", () => {
    expect(card(viewed(), "joined").data.branch).toBeUndefined();
  });

  it("counts the nodes each way over the whole graph", () => {
    expect(viewed({ focus: "joined" }).counts).toStrictEqual({
      downstream: 2,
      name: "Joined orders",
      upstream: 3,
    });
  });

  it("counts the nodes within depth hops each way", () => {
    expect(viewed({ depth: 1, focus: "joined" }).counts).toStrictEqual({
      downstream: 2,
      name: "Joined orders",
      upstream: 2,
    });
  });

  it("names the counts by the focused id when no node has it", () => {
    expect(viewed({ focus: "ghost" }).counts?.name).toBe("ghost");
  });

  it("returns no counts while nothing is focused", () => {
    expect(viewed().counts).toBeUndefined();
  });
});
