import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { EDGES, NODES, traced } from "#directed-graph/directed-graph.fixtures.tsx";
import { DirectedGraph } from "#directed-graph/directed-graph.tsx";
import { laidOut, namesOf } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

describe("DirectedGraph", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(
        () => (
          <DirectedGraph
            caption="Joined orders feed the revenue report."
            defaultFocus="joined"
            edges={EDGES}
            label="Revenue lineage"
            nodes={NODES}
          />
        ),
        { frame: true },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders every node named by its label once React Flow has placed it", async () => {
    const { container } = await traced();

    expect(namesOf(container)).toStrictEqual([
      "Orders",
      "Customers",
      "Clean orders",
      "Joined orders",
      "Revenue",
      "Churn",
      "Web logs",
      "Traffic",
    ]);
  });

  it("shows the viewport once the nodes are placed", async () => {
    const { container } = await traced();

    expect(container.querySelector<HTMLElement>(".react-flow")?.dataset["placing"]).toBeUndefined();
  });

  it("names the canvas by the label", async () => {
    const { getByRole } = await traced();

    expect(getByRole("application", { name: "Revenue lineage" }).tagName).toBe("DIV");
  });

  it("names the figure by the caption", async () => {
    const { getByRole } = await traced({ caption: "Joined orders feed two reports." });

    expect(getByRole("figure", { name: "Joined orders feed two reports." }).tagName).toBe("FIGURE");
  });

  it("renders the controls before the canvas", async () => {
    const { container } = await traced({ controls: <Graph.ZoomLevel /> });

    expect(slotElement(container, "graph", "root").firstElementChild?.tagName).toBe("OUTPUT");
  });

  it("passes the figure's props to the root", async () => {
    const { container } = await traced({ id: "lineage" });

    expect(slotElement(container, "graph", "root").id).toBe("lineage");
  });

  it("runs the edges down by default", async () => {
    const { container } = await traced();

    expect(
      container.querySelector<HTMLElement>(".react-flow__handle.target")?.dataset["handlepos"],
    ).toBe("top");
  });

  it("runs the edges right while the direction is right", async () => {
    const { container } = await traced({ direction: "right" });

    expect(
      container.querySelector<HTMLElement>(".react-flow__handle.target")?.dataset["handlepos"],
    ).toBe("left");
  });

  it("writes the caller's prompt", async () => {
    const { getByRole } = await traced({ promptLabel: "Pick a table." });

    expect(getByRole("status").textContent).toBe("Pick a table.");
  });

  it("writes the caller's summary", async () => {
    const { getByRole } = await traced({
      defaultFocus: "joined",
      summary: ({ name }) => `${name} traced`,
    });

    expect(getByRole("status").textContent).toBe("Joined orders traced");
  });

  it("writes the caller's words on the clear control", async () => {
    const { getByRole } = await traced({ clearLabel: "Show everything" });

    expect(getByRole("button", { name: "Show everything" }).tagName).toBe("BUTTON");
  });

  it.each([
    { id: "joined", props: { focusLabel: "Here" }, want: "Here" },
    { id: "clean", props: { upstreamLabel: "Before" }, want: "Before" },
    { id: "revenue", props: { downstreamLabel: "After" }, want: "After" },
  ])("writes the caller's relation word on $id", async ({ id, props, want }) => {
    const { container } = await traced({ defaultFocus: "joined", ...props });
    const node = container.querySelector<HTMLElement>(`.react-flow__node[data-id="${id}"]`);

    expect(node?.getAttribute("aria-label")?.endsWith(want)).toBe(true);
  });

  it("writes the caller's words on a control that closes a branch", async () => {
    const { getByRole } = await traced({
      collapseLabel: (count) => `Fold ${String(count)}`,
      collapsible: true,
    });

    expect(getByRole("button", { name: "Fold 2" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("writes the caller's words on a control that opens a branch", async () => {
    const { getByRole } = await traced({
      collapsible: true,
      defaultCollapsed: ["joined"],
      expandLabel: (count) => `Unfold ${String(count)}`,
    });

    expect(getByRole("button", { name: "Unfold 2" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("names the edges in the caller's words", async () => {
    const { container } = await traced({
      edgeName: ({ source, target }) => `${source} feeds ${target}`,
    });

    expect(
      container
        .querySelector('.react-flow__edge[data-id="orders-clean"]')
        ?.getAttribute("aria-label"),
    ).toBe("Orders feeds Clean orders");
  });

  it("describes the nodes in the caller's words", async () => {
    const { container } = await traced({ nodeDescription: "Press Enter to trace." });
    const id = container.querySelector(".react-flow__node")?.getAttribute("aria-describedby");

    expect(container.querySelector(`[id="${String(id)}"]`)?.textContent).toBe(
      "Press Enter to trace.",
    );
  });

  it("writes the caller's empty message", async () => {
    const { container } = await traced({ edges: [], emptyLabel: "Nothing here.", nodes: [] });

    expect(slotElement(container, "graph", "empty").textContent).toBe("Nothing here.");
  });

  it("renders the empty message in the canvas's place without a node", async () => {
    const { container } = await traced({ edges: [], nodes: [] });

    expect(slotElement(container, "graph", "empty").textContent).toBe("No nodes to show.");
  });

  it("renders no canvas without a node", async () => {
    const { container } = await traced({ edges: [], nodes: [] });

    expect(container.querySelector(".react-flow")).toBeNull();
  });

  it("renders no controls without a node", async () => {
    const { container } = await traced({ controls: <Graph.ZoomLevel />, edges: [], nodes: [] });

    expect(container.querySelector("output")).toBeNull();
  });

  it("renders the caption without a node", async () => {
    const { getByRole } = await traced({ caption: "Nothing matches.", edges: [], nodes: [] });

    expect(getByRole("figure", { name: "Nothing matches." }).tagName).toBe("FIGURE");
  });
});
