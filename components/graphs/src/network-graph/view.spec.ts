import { describe, expect, it } from "vitest";

import { LINKS, NODES } from "#network-graph/network-graph.fixtures.tsx";
import { drawnOf } from "#network-graph/network.ts";
import { type Placed } from "#network-graph/places.ts";
import { type DiscNode, type View, type ViewInput, viewOf } from "#network-graph/view.ts";
import { WORDS } from "#network-graph/words.ts";

const SIZE = { height: 80, width: 72 };

const PLACED: Placed[] = NODES.map((node, at) => ({
  disc: 40 + at,
  node,
  position: { x: at * 100, y: at * 10 },
}));

const MEASURED = new Map(NODES.map(({ id }) => [id, SIZE]));

function viewed(input: Partial<ViewInput> = {}): View {
  return viewOf({
    depth: 1,
    drawn: drawnOf(NODES, LINKS),
    focus: null,
    placed: PLACED,
    sizes: new Map(),
    words: WORDS,
    ...input,
  });
}

function disc(view: View, id: string): DiscNode {
  const found = view.nodes.find((node) => node.id === id);

  if (found === undefined) throw new Error(`No disc renders ${id}.`);

  return found;
}

function edgeOf(view: View, id: string): undefined | View["edges"][number] {
  return view.edges.find((edge) => edge.id === id);
}

describe("view", () => {
  it("reports the view incomplete while React Flow has not measured every node", () => {
    expect(viewed({ sizes: new Map([["fax", SIZE]]) }).complete).toBe(false);
  });

  it("reports the view complete once React Flow has measured every node", () => {
    expect(viewed({ sizes: MEASURED }).complete).toBe(true);
  });

  it("renders each node where the layout put it", () => {
    expect(disc(viewed(), "checkout").position).toStrictEqual({ x: 200, y: 20 });
  });

  it("places every node by the middle of its top edge", () => {
    expect(viewed().nodes.map(({ origin }) => origin)).toStrictEqual(NODES.map(() => [0.5, 0]));
  });

  it("passes a measured node's size to React Flow", () => {
    expect(disc(viewed({ sizes: new Map([["fax", SIZE]]) }), "fax").measured).toStrictEqual(SIZE);
  });

  it("passes no size for a node React Flow has not measured", () => {
    expect(disc(viewed(), "fax").measured).toBeUndefined();
  });

  it("types every node as the network's disc", () => {
    expect(new Set(viewed().nodes.map((node) => node.type))).toStrictEqual(new Set(["disc"]));
  });

  it("passes the placed diameter to each disc", () => {
    expect(disc(viewed(), "checkout").data.disc).toBe(42);
  });

  it("passes the node's name and icon to its disc", () => {
    const view = viewed({
      placed: [
        { disc: 36, node: { icon: "#", id: "fax", label: "Fax" }, position: { x: 0, y: 0 } },
      ],
    });

    expect(disc(view, "fax").data).toMatchObject({ icon: "#", label: "Fax" });
  });

  it("selects the focused node alone", () => {
    const view = viewed({ focus: "checkout" });

    expect(
      view.nodes.filter((node) => node.selected === true).map((node) => node.id),
    ).toStrictEqual(["checkout"]);
  });

  it("ends the focused node's accessible name with the focus word", () => {
    expect(disc(viewed({ focus: "checkout" }), "checkout").ariaLabel).toBe("Checkout, Focus");
  });

  it("ends a lit node's accessible name with the neighbour word", () => {
    expect(disc(viewed({ focus: "checkout" }), "kafka").ariaLabel).toBe("Kafka, Connected");
  });

  it("names a node outside the focus's reach by its label", () => {
    expect(disc(viewed({ focus: "checkout" }), "fax").ariaLabel).toBe("Fax");
  });

  it("names every node by its label while nothing is focused", () => {
    expect(viewed().nodes.map((node) => node.ariaLabel)).toStrictEqual(
      NODES.map((node) => node.label),
    );
  });

  it("dims a node outside the focus's reach", () => {
    expect(disc(viewed({ focus: "checkout" }), "auth").data.dimmed).toBe(true);
  });

  it("dims no lit node", () => {
    expect(disc(viewed({ focus: "checkout" }), "gateway").data.dimmed).toBe(false);
  });

  it("dims no node while nothing is focused", () => {
    expect(viewed().nodes.filter((node) => node.data.dimmed)).toStrictEqual([]);
  });

  it("lights the nodes within depth hops", () => {
    expect(disc(viewed({ depth: 2, focus: "checkout" }), "auth").data.dimmed).toBe(false);
  });

  it("renders every link as a straight line", () => {
    expect(new Set(viewed().edges.map((edge) => edge.type))).toStrictEqual(new Set(["straight"]));
  });

  it("makes every link unselectable", () => {
    expect(new Set(viewed().edges.map((edge) => edge.selectable))).toStrictEqual(new Set([false]));
  });

  it("gives a link without an id its ends' ids joined by a hyphen", () => {
    expect(viewed().edges[0]?.id).toBe("gateway-auth");
  });

  it("keeps a link's own id", () => {
    const view = viewed({
      drawn: drawnOf(NODES, [{ id: "calls", source: "gateway", target: "auth" }]),
    });

    expect(view.edges[0]?.id).toBe("calls");
  });

  it("names a link by the names of its ends", () => {
    expect(viewed().edges[0]?.ariaLabel).toBe("Gateway and Auth");
  });

  it("widens a link by its strength", () => {
    expect(edgeOf(viewed(), "gateway-auth")?.style).toStrictEqual({ "--graph-strength": "2" });
  });

  it("renders a link without a strength one hairline wide", () => {
    expect(edgeOf(viewed(), "auth-postgres")?.style).toStrictEqual({ "--graph-strength": "1" });
  });

  it("marks a link between the focus and a lit node on the lit set", () => {
    expect(edgeOf(viewed({ focus: "checkout" }), "checkout-kafka")?.domAttributes).toStrictEqual({
      "data-trace": "on",
    });
  });

  it("marks a link between two lit nodes on the lit set", () => {
    expect(
      edgeOf(viewed({ depth: 2, focus: "gateway" }), "checkout-postgres")?.domAttributes,
    ).toStrictEqual({ "data-trace": "on" });
  });

  it("marks a link with an end outside the focus's reach off the lit set", () => {
    expect(edgeOf(viewed({ focus: "checkout" }), "ledger-kafka")?.domAttributes).toStrictEqual({
      "data-trace": "off",
    });
  });

  it("marks no link while nothing is focused", () => {
    expect(edgeOf(viewed(), "checkout-kafka")?.domAttributes).toBeUndefined();
  });

  it("counts the nodes the focus lights", () => {
    expect(viewed({ focus: "checkout" }).connections).toStrictEqual({ count: 3, name: "Checkout" });
  });

  it("counts no node for a focus no link meets", () => {
    expect(viewed({ focus: "fax" }).connections).toStrictEqual({ count: 0, name: "Fax" });
  });

  it("names the connections by the focused id when no node has it", () => {
    expect(viewed({ focus: "ghost" }).connections?.name).toBe("ghost");
  });

  it("returns no connections while nothing is focused", () => {
    expect(viewed().connections).toBeUndefined();
  });
});
