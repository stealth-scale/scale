import { type ReactElement } from "react";

import { type Node as FlowNode, type NodeProps as FlowNodeProps } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { type GraphChangeType } from "#diff/diff.ts";
import { drawn } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

type CardNode = FlowNode<{ card: Graph.NodeProps }, "card">;

function Card({ data }: FlowNodeProps<CardNode>): ReactElement {
  return <Graph.Node {...data.card} />;
}

const TYPES = { card: Card };

const EMPTY: Partial<Graph.CanvasProps> = { changes: { edges: [], nodes: [] } };

function carded(
  card: Graph.NodeProps,
  root: Graph.RootProps = {},
  canvas: Partial<Graph.CanvasProps> = {},
): ReturnType<typeof drawn> {
  return drawn(
    {
      edges: [],
      nodes: [{ data: { card }, id: "join", position: { x: 0, y: 0 }, type: "card" }],
      nodeTypes: TYPES,
      ...canvas,
    },
    null,
    root,
  );
}

function changed(
  card: Graph.NodeProps,
  change: GraphChangeType,
  words: Partial<Graph.CanvasProps> = {},
): ReturnType<typeof drawn> {
  return carded(
    card,
    {},
    {
      changes: { edges: [], nodes: [{ change, fields: [], id: "join", label: "Join" }] },
      ...words,
    },
  );
}

function part(container: HTMLElement, slot: string): Element | null {
  return container.querySelector(`.${slotClass("graph", slot)}`);
}

function sideOf(container: HTMLElement, kind: "source" | "target"): string | undefined {
  return container.querySelector<HTMLElement>(`.react-flow__handle.${kind}`)?.dataset["handlepos"];
}

const PORTS = {
  inputs: [{ id: "in", label: "In" }],
  outputs: [{ id: "out", label: "Out" }],
};

describe("Node", () => {
  it("renders the title in the title slot", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(slotElement(container, "graph", "nodeTitle").textContent).toBe("Join customers");
  });

  it("renders the subtitle in the subtitle slot", async () => {
    const { container } = await carded({ subtitle: "Transform", title: "Join customers" });

    expect(slotElement(container, "graph", "nodeSubtitle").textContent).toBe("Transform");
  });

  it("renders no subtitle without one", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(part(container, "nodeSubtitle")).toBeNull();
  });

  it("renders the icon hidden from assistive technology", async () => {
    const { container } = await carded({ icon: <PlayIcon />, title: "Join customers" });

    expect(slotElement(container, "graph", "nodeIcon").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the caller's glyph in the icon slot", async () => {
    const { container } = await carded({ icon: <PlayIcon />, title: "Join customers" });

    expect(slotElement(container, "graph", "nodeIcon").querySelector("svg")).not.toBeNull();
  });

  it("renders no icon box without an icon", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(part(container, "nodeIcon")).toBeNull();
  });

  it("renders the status's word beside its dot", async () => {
    const { container } = await carded({
      status: { label: "Running", palette: "info" },
      title: "Join customers",
    });

    expect(slotElement(container, "status", "root").textContent).toBe("Running");
  });

  it("paints the status's dot in the status's palette", async () => {
    const { container } = await carded({
      status: { label: "Running", palette: "info" },
      title: "Join customers",
    });

    expect(slotElement(container, "status", "root").classList).toContain(
      slotVariantClass("status", "root", "palette", "info"),
    );
  });

  it("renders no status without one", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(container.querySelector(`.${slotClass("status", "root")}`)).toBeNull();
  });

  it("renders the actions outside React Flow's drag surface", async () => {
    const { container } = await carded({
      actions: <button type="button">Open</button>,
      title: "Join",
    });

    expect([...slotElement(container, "graph", "nodeActions").classList]).toStrictEqual(
      expect.arrayContaining(["nodrag", "nopan"]),
    );
  });

  it("renders no actions box without actions", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(part(container, "nodeActions")).toBeNull();
  });

  it("renders the children in the body slot", async () => {
    const { container } = await carded({ children: "Joins on customer_id", title: "Join" });

    expect(slotElement(container, "graph", "nodeBody").textContent).toBe("Joins on customer_id");
  });

  it("renders no body without children", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(part(container, "nodeBody")).toBeNull();
  });

  it("renders the problem of an invalid node", async () => {
    const { container } = await carded({ invalid: true, problem: "No key.", title: "Join" });

    expect(slotElement(container, "graph", "nodeProblem").textContent).toBe("No key.");
  });

  it("renders no problem while the node is valid", async () => {
    const { container } = await carded({ problem: "No key.", title: "Join customers" });

    expect(part(container, "nodeProblem")).toBeNull();
  });

  it("marks an invalid card with data-invalid", async () => {
    const { container } = await carded({ invalid: true, title: "Join customers" });

    expect(slotElement(container, "graph", "node").dataset["invalid"]).toBe("");
  });

  it("marks a dimmed card with data-dimmed", async () => {
    const { container } = await carded({ dimmed: true, title: "Join customers" });

    expect(slotElement(container, "graph", "node").dataset["dimmed"]).toBe("");
  });

  it("marks neither state on a card by default", async () => {
    const { container } = await carded({ title: "Join customers" });
    const { dataset } = slotElement(container, "graph", "node");

    expect([dataset["dimmed"], dataset["invalid"]]).toStrictEqual([undefined, undefined]);
  });

  it("puts the inputs on the side the graph's edges enter", async () => {
    const { container } = await carded({ ...PORTS, title: "Join" }, { direction: "right" });

    expect(sideOf(container, "target")).toBe("left");
  });

  it("puts the outputs on the side the graph's edges leave", async () => {
    const { container } = await carded({ ...PORTS, title: "Join" }, { direction: "right" });

    expect(sideOf(container, "source")).toBe("right");
  });

  it("puts the ports on the sides its own direction names", async () => {
    const { container } = await carded({ ...PORTS, direction: "right", title: "Join" });

    expect(sideOf(container, "target")).toBe("left");
  });

  it("renders no port without inputs or outputs", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(container.querySelectorAll(".react-flow__handle")).toHaveLength(0);
  });

  it("renders the tag in the tag slot", async () => {
    const { container } = await carded({ tag: "Upstream", title: "Join customers" });

    expect(slotElement(container, "graph", "nodeTag").textContent).toBe("Upstream");
  });

  it("renders no tag box without a tag", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(part(container, "nodeTag")).toBeNull();
  });

  it("renders the branch control in the branch slot", async () => {
    const { container } = await carded({
      branch: <button type="button">Hide 3</button>,
      title: "Join customers",
    });

    expect(slotElement(container, "graph", "nodeBranch").textContent).toBe("Hide 3");
  });

  it("renders the branch control after the handles it covers", async () => {
    const { container } = await carded({
      ...PORTS,
      branch: <button type="button">Hide 3</button>,
      title: "Join customers",
    });

    expect(slotElement(container, "graph", "node").lastElementChild?.className).toContain(
      slotClass("graph", "nodeBranch"),
    );
  });

  it("renders no branch box without a branch control", async () => {
    const { container } = await carded({ title: "Join customers" });

    expect(part(container, "nodeBranch")).toBeNull();
  });

  it.each([
    { change: "added", want: "+ Added" },
    { change: "changed", want: "~ Changed" },
    { change: "removed", want: "− Removed" },
  ] as const)("tags a card whose change is $change with $want", async ({ change, want }) => {
    const { container } = await changed({ title: "Join customers" }, change);

    expect(slotElement(container, "graph", "nodeTag").textContent).toBe(want);
  });

  it.each([
    { change: "added", palette: "success" },
    { change: "changed", palette: "warning" },
    { change: "removed", palette: "error" },
  ] as const)("paints the tag of a $change card in $palette", async ({ change, palette }) => {
    const { container } = await changed({ title: "Join customers" }, change);

    expect(part(container, "nodeTag")?.firstElementChild?.className).toContain(`--${palette}`);
  });

  it("hides a change's tag from assistive technology", async () => {
    const { container } = await changed({ title: "Join customers" }, "added");

    expect(part(container, "nodeTag")?.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("writes the caller's word in a change's tag", async () => {
    const { container } = await changed({ title: "Join customers" }, "added", {
      addedLabel: "Neu",
    });

    expect(slotElement(container, "graph", "nodeTag").textContent).toBe("+ Neu");
  });

  it("renders no tag on an unchanged card", async () => {
    const { container } = await changed({ title: "Join customers" }, "unchanged");

    expect(part(container, "nodeTag")).toBeNull();
  });

  it("recedes an unchanged card", async () => {
    const { container } = await changed({ title: "Join customers" }, "unchanged");

    expect(slotElement(container, "graph", "node").dataset["dimmed"]).toBe("");
  });

  it("keeps a changed card at rest", async () => {
    const { container } = await changed({ title: "Join customers" }, "changed");

    expect(slotElement(container, "graph", "node").dataset["dimmed"]).toBeUndefined();
  });

  it("keeps the card's own tag over its change", async () => {
    const { container } = await changed({ tag: "Upstream", title: "Join customers" }, "added");

    expect(slotElement(container, "graph", "nodeTag").textContent).toBe("Upstream");
  });

  it("keeps the card's own dimmed over its change", async () => {
    const { container } = await changed({ dimmed: false, title: "Join customers" }, "unchanged");

    expect(slotElement(container, "graph", "node").dataset["dimmed"]).toBeUndefined();
  });

  it("renders no tag on a card the comparison does not list", async () => {
    const { container } = await carded({ title: "Join customers" }, {}, EMPTY);

    expect(part(container, "nodeTag")).toBeNull();
  });
});
