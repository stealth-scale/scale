import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EDGES, NODES, traced } from "#directed-graph/directed-graph.fixtures.tsx";
import { DirectedGraph } from "#directed-graph/directed-graph.tsx";
import { keyed, laidOut, nodeOf, pressed, settled } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

const SUMMARY = "Joined orders: 3 upstream, 2 downstream";

const PROMPT = "Select a node to trace what feeds it and what it feeds.";

function positionOf(container: HTMLElement, name: string): string {
  return nodeOf(container, name).style.transform;
}

function paneOf(container: HTMLElement): HTMLElement {
  const pane = container.querySelector<HTMLElement>(".react-flow__pane");

  if (pane === null) throw new Error("React Flow rendered no pane.");

  return pane;
}

describe("Traced", () => {
  it("focuses the node a press selects", async () => {
    const { container, getByRole } = await traced();

    await pressed(nodeOf(container, "Joined orders"));

    expect(getByRole("status").textContent).toBe(SUMMARY);
  });

  it("focuses the node Enter selects", async () => {
    const { container, getByRole } = await traced();

    await keyed(nodeOf(container, "Joined orders"), "Enter");

    expect(getByRole("status").textContent).toBe(SUMMARY);
  });

  it("clears the focus on Escape", async () => {
    const { container, getByRole } = await traced({ defaultFocus: "joined" });

    await keyed(nodeOf(container, "Joined orders"), "Escape");

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("clears the focus when the canvas's background is pressed", async () => {
    const { container, getByRole } = await traced({ defaultFocus: "joined" });

    await pressed(paneOf(container));

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("clears the focus when the readout's control is pressed", async () => {
    const { getByRole } = await traced({ defaultFocus: "joined" });

    await pressed(getByRole("button", { name: "Clear focus" }));

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("moves no node when a node takes the focus", async () => {
    const { container } = await traced();
    const before = positionOf(container, "Web logs");

    await pressed(nodeOf(container, "Joined orders"));

    expect(positionOf(container, "Web logs")).toBe(before);
  });

  it("names each node by its label and its relation", async () => {
    const { container } = await traced({ defaultFocus: "joined" });

    expect(nodeOf(container, "Clean orders").getAttribute("aria-label")).toBe(
      "Clean orders, Upstream",
    );
  });

  it("describes each node by the trace's instruction", async () => {
    const { container } = await traced();
    const id = nodeOf(container, "Orders").getAttribute("aria-describedby");

    expect(container.querySelector(`[id="${String(id)}"]`)?.textContent).toBe(
      "Press Enter or Space to trace the node, and Escape to clear the trace.",
    );
  });

  it("makes no node draggable", async () => {
    const { container } = await traced();

    expect(container.querySelectorAll(".react-flow__node.draggable")).toHaveLength(0);
  });

  it("makes no handle take connections", async () => {
    const { container } = await traced();

    expect(container.querySelectorAll(".react-flow__handle.connectable")).toHaveLength(0);
  });

  it("gives no edge a tab stop", async () => {
    const { container } = await traced();

    expect(container.querySelectorAll(".react-flow__edge[tabindex]")).toHaveLength(0);
  });

  it("removes no node on Delete", async () => {
    const { container } = await traced({ defaultFocus: "joined" });

    fireEvent.keyDown(document.body, { code: "Delete", key: "Delete" });
    fireEvent.keyUp(document.body, { code: "Delete", key: "Delete" });
    await settled();

    expect(container.querySelectorAll(".react-flow__node")).toHaveLength(NODES.length);
  });

  it("marks the edges on the traced path", async () => {
    const { container } = await traced({ defaultFocus: "joined" });

    expect(
      container.querySelector<SVGElement>('.react-flow__edge[data-id="orders-clean"]')?.dataset[
        "trace"
      ],
    ).toBe("on");
  });

  it("names each edge by the names of its ends", async () => {
    const { container } = await traced();

    expect(
      container
        .querySelector('.react-flow__edge[data-id="orders-clean"]')
        ?.getAttribute("aria-label"),
    ).toBe("Orders to Clean orders");
  });

  it("hides the viewport until React Flow has measured the nodes", async () => {
    laidOut();

    const { container } = render(
      <DirectedGraph edges={EDGES} label="Revenue lineage" nodes={NODES} />,
    );
    const placing = container.querySelector<HTMLElement>(".react-flow")?.dataset["placing"];

    await settled();

    expect(placing).toBe("");
  });

  it("fits the view at most at the graph's own size", async () => {
    const { container } = await traced({
      controls: <Graph.ZoomLevel />,
      edges: [],
      nodes: NODES.slice(0, 1),
    });

    expect(container.querySelector(".graph__level")?.textContent).toBe("100%");
  });

  it("fits the view to the laid-out graph", async () => {
    const { container } = await traced({ controls: <Graph.ZoomLevel /> });

    expect(container.querySelector(".graph__level")?.textContent).toBe("50%");
  });

  it("fits the view again when an isolated trace changes the nodes shown", async () => {
    const { container } = await traced({
      controls: <Graph.ZoomLevel />,
      defaultFocus: "logs",
      trace: "isolate",
    });
    const alone = container.querySelector(".graph__level")?.textContent;

    await pressed(paneOf(container));

    expect([alone, container.querySelector(".graph__level")?.textContent]).toStrictEqual([
      "100%",
      "50%",
    ]);
  });

  it("keeps the view where a person zoomed it when a node takes the focus", async () => {
    const { container, getByRole } = await traced({
      controls: (
        <Graph.Controls>
          <Graph.Control action="zoomIn" label="Zoom in" />
          <Graph.ZoomLevel />
        </Graph.Controls>
      ),
    });

    await pressed(getByRole("button", { name: "Zoom in" }));

    const zoomed = container.querySelector(".graph__level")?.textContent;

    await pressed(nodeOf(container, "Joined orders"));

    expect(container.querySelector(".graph__level")?.textContent).toBe(zoomed);
  });

  it("keeps the focus when the focused node is pressed with a modifier key", async () => {
    const { container, getByRole } = await traced({ defaultFocus: "joined" });

    fireEvent.keyDown(document, { key: "Control" });
    fireEvent.keyDown(document, { key: "Meta" });
    await pressed(nodeOf(container, "Joined orders"));
    fireEvent.keyUp(document, { key: "Meta" });
    fireEvent.keyUp(document, { key: "Control" });

    expect(getByRole("status").textContent).toBe(SUMMARY);
  });

  it("keeps the canvas out of box selection while Shift is down", async () => {
    const { container } = await traced();

    fireEvent.keyDown(document, { key: "Shift" });
    await settled();

    const selecting = paneOf(container).classList.contains("selection");

    fireEvent.keyUp(document, { key: "Shift" });
    await settled();

    expect(selecting).toBe(false);
  });

  it("renders the overview at the end of the readout's row", async () => {
    const { container } = await traced({ overview: <Graph.MiniMap label="Overview" /> });

    expect(container.querySelector(".graph__summary")?.lastElementChild?.className).toContain(
      "graph__overview",
    );
  });
});
