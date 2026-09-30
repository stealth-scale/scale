import { fireEvent } from "@testing-library/react";
import { type Node as FlowNode } from "@xyflow/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";

import { type GraphDiff } from "#diff/diff.ts";
import { ITEM } from "#graph/drop.ts";
import {
  drawn,
  EDGES,
  keyed,
  laidOut,
  nodeOf,
  NODES,
  SELECTED,
  settled,
} from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

const TALL: FlowNode[] = Array.from({ length: 20 }, (_, index) => ({
  data: { label: `Step ${String(index + 1)}` },
  id: `step-${String(index)}`,
  position: { x: 0, y: index * 120 },
}));

const CHANGES: GraphDiff = {
  edges: [{ change: "added", fields: [], id: "clean-revenue", label: "Clean orders to Revenue" }],
  nodes: [{ change: "added", fields: [], id: "revenue", label: "Revenue" }],
};

function nodesOf(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(".react-flow__node")];
}

function nameOf(container: HTMLElement, id: string): null | string | undefined {
  return nodesOf(container)
    .find((node) => node.dataset["id"] === id)
    ?.getAttribute("aria-label");
}

function describedBy(container: HTMLElement, selector: string): null | string | undefined {
  const id = container.querySelector(selector)?.getAttribute("aria-describedby");

  return id === null || id === undefined
    ? id
    : container.querySelector(`[id="${id}"]`)?.textContent;
}

async function deleted(
  props: Partial<Graph.CanvasProps>,
  key: string,
): Promise<Mock<NonNullable<Graph.CanvasProps["onNodesDelete"]>>> {
  const onNodesDelete = vi.fn<NonNullable<Graph.CanvasProps["onNodesDelete"]>>();

  await drawn({ nodes: SELECTED, onNodesDelete, ...props });
  fireEvent.keyDown(document.body, { code: key, key });
  fireEvent.keyUp(document.body, { code: key, key });
  await settled();

  return onNodesDelete;
}

describe("Canvas", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(
        () => (
          <Graph.Root>
            <Graph.Canvas edges={EDGES} label="Nightly pipeline" nodes={NODES} readOnly />
          </Graph.Root>
        ),
        { frame: true },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("names React Flow's application by the label", async () => {
    const { getByRole } = await drawn();

    expect(getByRole("application", { name: "Nightly pipeline" })).toBeDefined();
  });

  it("renders the kit's node for each built-in type", async () => {
    const { container } = await drawn();

    expect(
      [...container.querySelectorAll(".graph__nodeTitle, .graph__node-title")].map(
        (title) => title.textContent,
      ),
    ).toStrictEqual(["Orders", "Clean orders", "Revenue"]);
  });

  it("renders an edge per edge", async () => {
    const { container } = await drawn();

    expect(container.querySelectorAll(".react-flow__edge")).toHaveLength(2);
  });

  it("renders the dotted background unless background is off", async () => {
    const { container } = await drawn({ background: false });

    expect(container.querySelector(".react-flow__background")).toBeNull();
  });

  it("renders the dotted background by default", async () => {
    const { container } = await drawn();

    expect(container.querySelector(".react-flow__background")).not.toBeNull();
  });

  it("renders its children inside React Flow", async () => {
    const { getByText } = await drawn({ children: <p>Last run at 02:00</p> });

    expect(getByText("Last run at 02:00").closest(".react-flow")).not.toBeNull();
  });

  it("fits the view at most at the graph's own size", async () => {
    const { getByRole } = await drawn({ edges: [], nodes: NODES.slice(0, 1) }, <Graph.ZoomLevel />);

    expect(getByRole("status").textContent).toBe("100%");
  });

  it("fits the view inside the canvas's margins", async () => {
    const { getByRole } = await drawn({ edges: [], nodes: TALL.slice(0, 4) }, <Graph.ZoomLevel />);

    expect(getByRole("status").textContent).toBe("72%");
  });

  it("fits a graph taller than its canvas below half its size", async () => {
    const { getByRole } = await drawn({ edges: [], nodes: TALL }, <Graph.ZoomLevel />);

    expect(getByRole("status").textContent).toBe("13%");
  });

  it("names each node by its data's label", async () => {
    const { getByRole } = await drawn();

    expect(getByRole("group", { name: "Clean orders" }).dataset["id"]).toBe("clean");
  });

  it("names each edge by the names of its ends", async () => {
    const { getByRole } = await drawn();

    expect(getByRole("group", { name: "Orders to Clean orders" }).dataset["id"]).toBe(
      "orders-clean",
    );
  });

  it("names each edge in the caller's words", async () => {
    const { getByRole } = await drawn({
      edgeName: ({ source, target }) => `${source} feeds ${target}`,
    });

    expect(getByRole("group", { name: "Orders feeds Clean orders" })).toBeDefined();
  });

  it("places the attribution in the bottom-start corner", async () => {
    const { container } = await drawn();

    expect([
      ...(container.querySelector(".react-flow__attribution")?.classList ?? []),
    ]).toStrictEqual(expect.arrayContaining(["bottom", "left"]));
  });

  it("gives each node of a read-only canvas a tab stop", async () => {
    const { container } = await drawn({ readOnly: true });

    expect(nodesOf(container).map((node) => node.tabIndex)).toStrictEqual([0, 0, 0]);
  });

  it("turns off selecting the nodes of a read-only canvas", async () => {
    const { container } = await drawn({ readOnly: true });

    expect(nodesOf(container).some((node) => node.classList.contains("selectable"))).toBe(false);
  });

  it("turns off dragging the nodes of a read-only canvas", async () => {
    const { container } = await drawn({ readOnly: true });

    expect(nodesOf(container).some((node) => node.classList.contains("draggable"))).toBe(false);
  });

  it("gives the edges of a read-only canvas no tab stop", async () => {
    const { container } = await drawn({ readOnly: true });

    expect(container.querySelector(".react-flow__edge")?.getAttribute("tabindex")).toBeNull();
  });

  it("describes no key on the nodes of a read-only canvas", async () => {
    const { container } = await drawn({ readOnly: true });

    expect(describedBy(container, ".react-flow__node")).toBeNull();
  });

  it("describes the nodes of a read-only canvas by nothing while its keys are on", async () => {
    const { container } = await drawn({ disableKeyboardA11y: false, readOnly: true });

    expect(describedBy(container, ".react-flow__node")).toBe("");
  });

  it("makes the nodes of an editable canvas selectable", async () => {
    const { container } = await drawn();

    expect(nodesOf(container).every((node) => node.classList.contains("selectable"))).toBe(true);
  });

  it("makes the nodes of an editable canvas draggable", async () => {
    const { container } = await drawn();

    expect(nodesOf(container).every((node) => node.classList.contains("draggable"))).toBe(true);
  });

  it("describes each node of an editable canvas by the keys it takes", async () => {
    const { container } = await drawn();

    expect(describedBy(container, ".react-flow__node")).toBe(
      "Press Enter or Space to select the node, the arrow keys to move it, Delete to remove it and Escape to clear the selection.",
    );
  });

  it("describes each edge of an editable canvas by the keys it takes", async () => {
    const { container } = await drawn();

    expect(describedBy(container, ".react-flow__edge")).toBe(
      "Press Enter or Space to select the connection, Delete to remove it and Escape to clear the selection.",
    );
  });

  it("describes each node by the caller's words", async () => {
    const { container } = await drawn({ nodeDescription: "Press Enter to open the step." });

    expect(describedBy(container, ".react-flow__node")).toBe("Press Enter to open the step.");
  });

  it("removes the selection on Delete", async () => {
    const onNodesDelete = await deleted({}, "Delete");

    expect(onNodesDelete).toHaveBeenCalledOnce();
  });

  it("removes the selection on Backspace", async () => {
    const onNodesDelete = await deleted({}, "Backspace");

    expect(onNodesDelete).toHaveBeenCalledOnce();
  });

  it.each(["Delete", "Backspace"])(
    "keeps the selection of a read-only canvas on %s",
    async (key) => {
      const onNodesDelete = await deleted({ readOnly: true }, key);

      expect(onNodesDelete).not.toHaveBeenCalled();
    },
  );

  it("applies the caller's props over the mode's switches", async () => {
    const { container } = await drawn({ elementsSelectable: true, readOnly: true });

    expect(nodesOf(container).every((node) => node.classList.contains("selectable"))).toBe(true);
  });

  it("ends a changed node's name with its change's word", async () => {
    const { container } = await drawn({ changes: CHANGES });

    expect(nameOf(container, "revenue")).toBe("Revenue, Added");
  });

  it("writes the caller's words for the changes", async () => {
    const { container } = await drawn({ addedLabel: "Neu", changes: CHANGES });

    expect(nameOf(container, "revenue")).toBe("Revenue, Neu");
  });

  it("marks a changed edge on React Flow's element", async () => {
    const { container } = await drawn({ changes: CHANGES });

    expect(
      container.querySelector<SVGElement>('.react-flow__edge[data-id="clean-revenue"]')?.dataset[
        "change"
      ],
    ).toBe("added");
  });

  it("marks no edge without changes", async () => {
    const { container } = await drawn();

    expect(container.querySelectorAll(".react-flow__edge[data-change]")).toHaveLength(0);
  });

  it("reports a move an arrow key makes through onGraphChange", async () => {
    const onGraphChange = vi.fn<NonNullable<Graph.CanvasProps["onGraphChange"]>>();
    const { container } = await drawn({ nodes: SELECTED, onGraphChange });

    await keyed(nodeOf(container, "Clean orders"), "ArrowRight");

    expect(onGraphChange.mock.lastCall?.[1]).toStrictEqual({
      edges: [],
      nodes: ["clean"],
      type: "move",
    });
  });

  it("reports a removal by Delete with the node's edges through onGraphChange", async () => {
    const onGraphChange = vi.fn<NonNullable<Graph.CanvasProps["onGraphChange"]>>();

    await drawn({ nodes: SELECTED, onGraphChange });
    fireEvent.keyDown(document.body, { code: "Delete", key: "Delete" });
    fireEvent.keyUp(document.body, { code: "Delete", key: "Delete" });
    await settled();

    expect(onGraphChange.mock.lastCall?.[1]).toStrictEqual({
      edges: ["orders-clean", "clean-revenue"],
      nodes: ["clean"],
      type: "remove",
    });
  });

  it("reports a palette item dropped on the canvas through onDropItem", async () => {
    const onDropItem = vi.fn<NonNullable<Graph.CanvasProps["onDropItem"]>>();
    const { container } = await drawn({ fitView: false, onDropItem });
    const flow = container.querySelector(".react-flow");

    if (flow === null) throw new Error("React Flow rendered no element.");

    const event = new MouseEvent("drop", {
      bubbles: true,
      cancelable: true,
      clientX: 200,
      clientY: 100,
    });

    Object.defineProperty(event, "dataTransfer", {
      value: { getData: () => "judge", types: [ITEM] },
    });
    fireEvent(flow, event);

    expect(onDropItem.mock.lastCall).toStrictEqual(["judge", { x: 200, y: 100 }]);
  });
});
