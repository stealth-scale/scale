import { type Node as FlowNode } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { drawn } from "#graph/graph.fixtures.tsx";
import type * as Graph from "#graph/index.ts";

function nodeOf(container: HTMLElement, id: string): HTMLElement {
  const node = container.querySelector<HTMLElement>(`.react-flow__node[data-id="${id}"]`);

  if (node === null) throw new Error(`No node ${id} rendered.`);

  return node;
}

function portsOf(container: HTMLElement, id: string, kind: "source" | "target"): string[] {
  return [...nodeOf(container, id).querySelectorAll(`.react-flow__handle.${kind}`)].map(
    (handle) => handle.textContent,
  );
}

function labelled(data: Graph.LabelNodeData): ReturnType<typeof drawn> {
  const nodes: FlowNode[] = [{ data, id: "step", position: { x: 0, y: 0 } }];

  return drawn({ edges: [], nodes });
}

describe("LabelNode", () => {
  it("renders an input node without a port edges enter", async () => {
    const { container } = await drawn();

    expect(portsOf(container, "orders", "target")).toStrictEqual([]);
  });

  it("renders an output node without a port edges leave", async () => {
    const { container } = await drawn();

    expect(portsOf(container, "revenue", "source")).toStrictEqual([]);
  });

  it("gives a default node a port named In where edges enter", async () => {
    const { container } = await drawn();

    expect(portsOf(container, "clean", "target")).toStrictEqual(["In"]);
  });

  it("gives a default node a port named Out where edges leave", async () => {
    const { container } = await drawn();

    expect(portsOf(container, "clean", "source")).toStrictEqual(["Out"]);
  });

  it("renders the inputs the data states", async () => {
    const { container } = await labelled({
      inputs: [
        { id: "left", label: "Left" },
        { id: "right", label: "Right" },
      ],
      label: "Join",
    });

    expect(portsOf(container, "step", "target")).toStrictEqual(["Left", "Right"]);
  });

  it("renders the outputs the data states", async () => {
    const { container } = await labelled({
      label: "Judge",
      outputs: [{ id: "pass", label: "Pass" }],
    });

    expect(portsOf(container, "step", "source")).toStrictEqual(["Pass"]);
  });

  it("titles the card by the data's label", async () => {
    const { container } = await labelled({ label: "Join customers" });

    expect(slotElement(container, "graph", "nodeTitle").textContent).toBe("Join customers");
  });

  it("renders the data's detail in the body", async () => {
    const { container } = await labelled({ detail: "Joins on customer_id", label: "Join" });

    expect(slotElement(container, "graph", "nodeBody").textContent).toBe("Joins on customer_id");
  });

  it("renders the data's subtitle", async () => {
    const { container } = await labelled({ label: "Join", subtitle: "Transform" });

    expect(slotElement(container, "graph", "nodeSubtitle").textContent).toBe("Transform");
  });

  it("renders the data's icon", async () => {
    const { container } = await labelled({ icon: <PlayIcon />, label: "Join" });

    expect(slotElement(container, "graph", "nodeIcon").querySelector("svg")).not.toBeNull();
  });

  it("renders the data's status", async () => {
    const { container } = await labelled({
      label: "Join",
      status: { label: "Running", palette: "info" },
    });

    expect(slotElement(container, "status", "root").textContent).toBe("Running");
  });

  it("renders the data's problem on an invalid card", async () => {
    const { container } = await labelled({ invalid: true, label: "Join", problem: "No key." });

    expect(slotElement(container, "graph", "nodeProblem").textContent).toBe("No key.");
  });
});
