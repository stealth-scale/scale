import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { keyed, laidOut, namesOf, nodeOf, pressed } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";
import { linked, LINKS, NODES } from "#network-graph/network-graph.fixtures.tsx";
import { NetworkGraph } from "#network-graph/network-graph.tsx";

function positionOf(container: HTMLElement, name: string): string {
  return nodeOf(container, name).style.transform;
}

describe("NetworkGraph", () => {
  it("returns no accessibility violation", async () => {
    laidOut();

    await expect(
      accessibilityViolations(
        () => (
          <NetworkGraph
            caption="Checkout calls three services."
            defaultFocus="checkout"
            label="Service topology"
            links={LINKS}
            nodes={NODES}
          />
        ),
        { frame: true },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders every node named by its label once React Flow has placed it", async () => {
    const { container } = await linked();

    expect(namesOf(container)).toStrictEqual(NODES.map((node) => node.label));
  });

  it("shows the viewport once the nodes are placed", async () => {
    const { container } = await linked();

    expect(container.querySelector<HTMLElement>(".react-flow")?.dataset["placing"]).toBeUndefined();
  });

  it("names the canvas by the label", async () => {
    const { getByRole } = await linked();

    expect(getByRole("application", { name: "Service topology" }).tagName).toBe("DIV");
  });

  it("names the figure by the caption", async () => {
    const { getByRole } = await linked({ caption: "Checkout calls three services." });

    expect(getByRole("figure", { name: "Checkout calls three services." }).tagName).toBe("FIGURE");
  });

  it("renders the controls before the canvas", async () => {
    const { container } = await linked({ controls: <Graph.ZoomLevel /> });

    expect(slotElement(container, "graph", "root").firstElementChild?.tagName).toBe("OUTPUT");
  });

  it("passes the figure's props to the root", async () => {
    const { container } = await linked({ id: "topology" });

    expect(slotElement(container, "graph", "root").id).toBe("topology");
  });

  it("writes the caller's prompt", async () => {
    const { getByRole } = await linked({ promptLabel: "Pick a service." });

    expect(getByRole("status").textContent).toBe("Pick a service.");
  });

  it("writes the caller's summary", async () => {
    const { getByRole } = await linked({
      defaultFocus: "checkout",
      summary: ({ count, name }) => `${name} talks to ${String(count)}`,
    });

    expect(getByRole("status").textContent).toBe("Checkout talks to 3");
  });

  it("writes the caller's words on the clear control", async () => {
    const { getByRole } = await linked({ clearLabel: "Show everything" });

    expect(getByRole("button", { name: "Show everything" }).tagName).toBe("BUTTON");
  });

  it("marks the clear control disabled while nothing is focused", async () => {
    const { getByRole } = await linked();

    expect(getByRole("button", { name: "Clear focus" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("follows a controlled focus", async () => {
    const { getByRole } = await linked({ focus: "kafka" });

    expect(getByRole("status").textContent).toBe("Kafka: 2 connections");
  });

  it("calls onFocusChange with the node a press focuses", async () => {
    const onFocusChange = vi.fn<(id: null | string) => void>();
    const { container } = await linked({ onFocusChange });

    await pressed(nodeOf(container, "Ledger"));

    expect(onFocusChange.mock.lastCall).toStrictEqual(["ledger"]);
  });

  it("lights the nodes within the hops depth states", async () => {
    const { getByRole } = await linked({ defaultFocus: "checkout", depth: 2 });

    expect(getByRole("status").textContent).toBe("Checkout: 5 connections");
  });

  it("lays the nodes out from the seed", async () => {
    const first = await linked();
    const before = positionOf(first.container, "Fax");

    first.unmount();

    const second = await linked({ seed: 7 });

    expect(positionOf(second.container, "Fax")).not.toBe(before);
  });

  it("runs the number of layout steps stated", async () => {
    const first = await linked();
    const before = positionOf(first.container, "Fax");

    first.unmount();

    const second = await linked({ iterations: 1 });

    expect(positionOf(second.container, "Fax")).not.toBe(before);
  });

  it("announces a move in the caller's words", async () => {
    const { container } = await linked({
      defaultFocus: "fax",
      moveAnnouncement: ({ direction }) => `Fax moved ${direction}`,
    });

    await keyed(nodeOf(container, "Fax"), "ArrowRight");

    expect(container.querySelector('[aria-live="assertive"]')?.textContent).toBe("Fax moved right");
  });

  it.each([
    { id: "checkout", props: { focusLabel: "Here" }, want: "Here" },
    { id: "kafka", props: { neighborLabel: "Next to it" }, want: "Next to it" },
  ])("writes the caller's word on $id", async ({ id, props, want }) => {
    const { container } = await linked({ defaultFocus: "checkout", ...props });
    const node = container.querySelector<HTMLElement>(`.react-flow__node[data-id="${id}"]`);

    expect(node?.getAttribute("aria-label")?.endsWith(want)).toBe(true);
  });

  it("names the links in the caller's words", async () => {
    const { container } = await linked({
      edgeName: ({ source, target }) => `${source} calls ${target}`,
    });

    expect(
      container
        .querySelector('.react-flow__edge[data-id="gateway-auth"]')
        ?.getAttribute("aria-label"),
    ).toBe("Gateway calls Auth");
  });

  it("describes the nodes in the caller's words", async () => {
    const { container } = await linked({ nodeDescription: "Press Enter to focus." });
    const id = container.querySelector(".react-flow__node")?.getAttribute("aria-describedby");

    expect(container.querySelector(`[id="${String(id)}"]`)?.textContent).toBe(
      "Press Enter to focus.",
    );
  });

  it("describes the nodes without the arrow keys while draggable is false", async () => {
    const { container } = await linked({ draggable: false });
    const id = container.querySelector(".react-flow__node")?.getAttribute("aria-describedby");

    expect(container.querySelector(`[id="${String(id)}"]`)?.textContent).toBe(
      "Press Enter or Space to focus the node, and Escape to clear the focus.",
    );
  });

  it("writes the caller's empty message", async () => {
    const { container } = await linked({ emptyLabel: "Nothing here.", links: [], nodes: [] });

    expect(slotElement(container, "graph", "empty").textContent).toBe("Nothing here.");
  });

  it("renders the empty message in the canvas's place without a node", async () => {
    const { container } = await linked({ links: [], nodes: [] });

    expect(slotElement(container, "graph", "empty").textContent).toBe("No nodes to show.");
  });

  it("renders no canvas without a node", async () => {
    const { container } = await linked({ links: [], nodes: [] });

    expect(container.querySelector(".react-flow")).toBeNull();
  });

  it("renders no controls without a node", async () => {
    const { container } = await linked({ controls: <Graph.ZoomLevel />, links: [], nodes: [] });

    expect(container.querySelector("output")).toBeNull();
  });

  it("renders the caption without a node", async () => {
    const { getByRole } = await linked({ caption: "Nothing reports.", links: [], nodes: [] });

    expect(getByRole("figure", { name: "Nothing reports." }).tagName).toBe("FIGURE");
  });
});
