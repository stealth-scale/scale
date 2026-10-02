import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { elapsed, keyed, laidOut, nodeOf, pressed, settled } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";
import { linked, LINKS, NODES } from "#network-graph/network-graph.fixtures.tsx";
import { NetworkGraph } from "#network-graph/network-graph.tsx";

const SUMMARY = "Checkout: 3 connections";

const PROMPT = "Select a node to show what it connects to.";

function positionOf(container: HTMLElement, name: string): string {
  return nodeOf(container, name).style.transform;
}

function paneOf(container: HTMLElement): HTMLElement {
  const pane = container.querySelector<HTMLElement>(".react-flow__pane");

  if (pane === null) throw new Error("React Flow rendered no pane.");

  return pane;
}

function levelOf(container: HTMLElement): string | undefined {
  return container.querySelector(".graph__level")?.textContent;
}

function numbersOf(transform = ""): number[] {
  return [...transform.matchAll(/-?[\d.]+/gu)].map(([number]) => Number(number));
}

function outsideOf(container: HTMLElement): string[] {
  const viewport = container.querySelector<HTMLElement>(".react-flow__viewport");
  const [x = 0, y = 0, zoom = 1] = numbersOf(viewport?.style.transform);
  const nodes = [...container.querySelectorAll<HTMLElement>(".react-flow__node")];

  return nodes
    .filter((node) => {
      const [left = 0, top = 0] = numbersOf(node.style.transform);
      const across = [left * zoom + x, (left + 256) * zoom + x];
      const down = [top * zoom + y, (top + 52) * zoom + y];

      return across.some((at) => at < 0 || at > 640) || down.some((at) => at < 0 || at > 360);
    })
    .map((node) => String(node.getAttribute("aria-label")));
}

describe("Linked", () => {
  it("focuses the node a press selects", async () => {
    const { container, getByRole } = await linked();

    await pressed(nodeOf(container, "Checkout"));

    expect(getByRole("status").textContent).toBe(SUMMARY);
  });

  it("focuses the node Enter selects", async () => {
    const { container, getByRole } = await linked();

    await keyed(nodeOf(container, "Checkout"), "Enter");

    expect(getByRole("status").textContent).toBe(SUMMARY);
  });

  it("clears the focus on Escape", async () => {
    const { container, getByRole } = await linked({ defaultFocus: "checkout" });

    await keyed(nodeOf(container, "Checkout"), "Escape");

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("clears the focus when the canvas's background is pressed", async () => {
    const { container, getByRole } = await linked({ defaultFocus: "checkout" });

    await pressed(paneOf(container));

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("clears the focus when the readout's control is pressed", async () => {
    const { getByRole } = await linked({ defaultFocus: "checkout" });

    await pressed(getByRole("button", { name: "Clear focus" }));

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("moves no node when a node takes the focus", async () => {
    const { container } = await linked();
    const before = positionOf(container, "Fax");

    await pressed(nodeOf(container, "Checkout"));

    expect(positionOf(container, "Fax")).toBe(before);
  });

  it("names each node by its label and its reach", async () => {
    const { container } = await linked({ defaultFocus: "checkout" });

    expect(nodeOf(container, "Kafka").getAttribute("aria-label")).toBe("Kafka, Connected");
  });

  it("describes each node by the keys that focus and move it", async () => {
    const { container } = await linked();
    const id = nodeOf(container, "Fax").getAttribute("aria-describedby");

    expect(container.querySelector(`[id="${String(id)}"]`)?.textContent).toBe(
      "Press Enter or Space to focus the node, the arrow keys to move it, and Escape to clear the focus.",
    );
  });

  it("makes every node draggable unless stated", async () => {
    const { container } = await linked();

    expect(container.querySelectorAll(".react-flow__node.draggable")).toHaveLength(NODES.length);
  });

  it("makes no node draggable while draggable is false", async () => {
    const { container } = await linked({ draggable: false });

    expect(container.querySelectorAll(".react-flow__node.draggable")).toHaveLength(0);
  });

  it("gives no link a tab stop", async () => {
    const { container } = await linked();

    expect(container.querySelectorAll(".react-flow__edge[tabindex]")).toHaveLength(0);
  });

  it("removes no node on Delete", async () => {
    const { container } = await linked({ defaultFocus: "checkout" });

    fireEvent.keyDown(document.body, { code: "Delete", key: "Delete" });
    fireEvent.keyUp(document.body, { code: "Delete", key: "Delete" });
    await settled();

    expect(container.querySelectorAll(".react-flow__node")).toHaveLength(NODES.length);
  });

  it("renders every link", async () => {
    const { container } = await linked();

    expect(container.querySelectorAll(".react-flow__edge")).toHaveLength(LINKS.length);
  });

  it("marks the links the focus lights", async () => {
    const { container } = await linked({ defaultFocus: "checkout" });

    expect(
      container.querySelector<SVGElement>('.react-flow__edge[data-id="checkout-kafka"]')?.dataset[
        "trace"
      ],
    ).toBe("on");
  });

  it("names each link by the names of its ends", async () => {
    const { container } = await linked();

    expect(
      container
        .querySelector('.react-flow__edge[data-id="gateway-auth"]')
        ?.getAttribute("aria-label"),
    ).toBe("Gateway and Auth");
  });

  it("widens a link by its strength", async () => {
    const { container } = await linked();
    const path = container.querySelector<SVGPathElement>(
      '.react-flow__edge[data-id="gateway-auth"] .react-flow__edge-path',
    );

    expect(path?.style.getPropertyValue("--graph-strength")).toBe("2");
  });

  it("hides the viewport until React Flow has measured the nodes", async () => {
    laidOut();

    const { container } = render(<NetworkGraph label="Topology" links={LINKS} nodes={NODES} />);
    const placing = container.querySelector<HTMLElement>(".react-flow")?.dataset["placing"];

    await settled();

    expect(placing).toBe("");
  });

  it("fits the view at most at the graph's own size", async () => {
    const { container } = await linked({
      controls: <Graph.ZoomLevel />,
      links: [],
      nodes: NODES.slice(0, 1),
    });

    expect(levelOf(container)).toBe("100%");
  });

  it("fits the view to the laid-out graph", async () => {
    const { container } = await linked({ controls: <Graph.ZoomLevel /> });

    expect(levelOf(container)).not.toBe("100%");
  });

  it("fits the view around every node React Flow measured", async () => {
    const { container } = await linked();

    expect(outsideOf(container)).toStrictEqual([]);
  });

  it("fits the view around the nodes a new graph adds once React Flow measured them", async () => {
    const { container, rerender } = await linked();
    const nodes = [...NODES, { id: "sms", label: "SMS" }, { id: "pager", label: "Pager" }];
    const links = [...LINKS, { source: "fax", target: "sms" }, { source: "sms", target: "pager" }];

    await act(async () => {
      rerender(<NetworkGraph label="Service topology" links={links} nodes={nodes} />);
      await elapsed();
    });

    expect(outsideOf(container)).toStrictEqual([]);
  });

  it("moves the focused node by an arrow key", async () => {
    const { container } = await linked({ defaultFocus: "fax" });
    const before = positionOf(container, "Fax");

    await keyed(nodeOf(container, "Fax"), "ArrowRight");

    expect(positionOf(container, "Fax")).not.toBe(before);
  });

  it("keeps the view where it is when a node moves", async () => {
    const { container } = await linked({ controls: <Graph.ZoomLevel />, defaultFocus: "fax" });
    const level = levelOf(container);

    await keyed(nodeOf(container, "Fax"), "ArrowRight");

    expect(levelOf(container)).toBe(level);
  });

  it("keeps the viewport shown through every commit of a move", async () => {
    const { container } = await linked({ defaultFocus: "fax" });
    const flow = container.querySelector(".react-flow");
    const records: MutationRecord[] = [];
    const observer = new MutationObserver((batch) => {
      records.push(...batch);
    });

    if (flow === null) throw new Error("React Flow rendered no element.");

    observer.observe(flow, { attributeFilter: ["data-placing"] });
    await keyed(nodeOf(container, "Fax"), "ArrowRight");
    records.push(...observer.takeRecords());
    observer.disconnect();

    expect(records).toHaveLength(0);
  });

  it("keeps the view where a person zoomed it when a node takes the focus", async () => {
    const { container, getByRole } = await linked({
      controls: (
        <Graph.Controls>
          <Graph.Control action="zoomIn" label="Zoom in" />
          <Graph.ZoomLevel />
        </Graph.Controls>
      ),
    });

    await pressed(getByRole("button", { name: "Zoom in" }));

    const zoomed = levelOf(container);

    await pressed(nodeOf(container, "Checkout"));

    expect(levelOf(container)).toBe(zoomed);
  });

  it("keeps the focus when the focused node is pressed with a modifier key", async () => {
    const { container, getByRole } = await linked({ defaultFocus: "checkout" });

    fireEvent.keyDown(document, { key: "Control" });
    fireEvent.keyDown(document, { key: "Meta" });
    await pressed(nodeOf(container, "Checkout"));
    fireEvent.keyUp(document, { key: "Meta" });
    fireEvent.keyUp(document, { key: "Control" });

    expect(getByRole("status").textContent).toBe(SUMMARY);
  });

  it("keeps the canvas out of box selection while Shift is down", async () => {
    const { container } = await linked();

    fireEvent.keyDown(document, { key: "Shift" });
    await settled();

    const selecting = paneOf(container).classList.contains("selection");

    fireEvent.keyUp(document, { key: "Shift" });
    await settled();

    expect(selecting).toBe(false);
  });

  it("renders the overview at the end of the readout's row", async () => {
    const { container } = await linked({ overview: <Graph.MiniMap label="Overview" /> });

    expect(container.querySelector(".graph__summary")?.lastElementChild?.className).toContain(
      "graph__overview",
    );
  });
});
