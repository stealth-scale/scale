import { fireEvent } from "@testing-library/react";
import { type Node as FlowNode } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

import { slotClass } from "@stealthscale/testing-theme";

import { drawn } from "#graph/graph.fixtures.tsx";
import type * as Graph from "#graph/index.ts";

function judge(data: Graph.LabelNodeData): FlowNode[] {
  return [{ data, id: "judge", position: { x: 0, y: 0 } }];
}

const JUDGE = judge({
  label: "Judge",
  outputs: [
    { id: "pass", label: "Pass" },
    { id: "fail", label: "Fail" },
  ],
});

function handles(container: HTMLElement, kind: "source" | "target"): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(`.react-flow__handle.${kind}`)];
}

function hiddenOf(container: HTMLElement, kind: "source" | "target"): Array<string | undefined> {
  return handles(container, kind).map(
    (handle) =>
      handle.querySelector<HTMLElement>(`.${slotClass("graph", "portName")}`)?.dataset["hidden"],
  );
}

function pressed(handle: HTMLElement | undefined): void {
  fireEvent.mouseDown(handle ?? document.body, { button: 0, clientX: 0, clientY: 0 });
  fireEvent.mouseMove(document, { clientX: 24, clientY: 24 });
  fireEvent.mouseUp(document, { clientX: 24, clientY: 24 });
}

describe("Ports", () => {
  it("spreads two ports of a side at its thirds", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(
      handles(container, "source").map((handle) =>
        handle.style.getPropertyValue("--graph-port-along"),
      ),
    ).toStrictEqual(["33.33333333333333%", "66.66666666666666%"]);
  });

  it("puts a lone port at the middle of its side", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(handles(container, "target")[0]?.style.getPropertyValue("--graph-port-along")).toBe(
      "50%",
    );
  });

  it("writes each port's name beside its handle while its side has two ports", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(hiddenOf(container, "source")).toStrictEqual([undefined, undefined]);
  });

  it("hides a lone port's name visually", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(hiddenOf(container, "target")).toStrictEqual([""]);
  });

  it("contains each port's name in its handle", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(handles(container, "source").map((handle) => handle.textContent)).toStrictEqual([
      "Pass",
      "Fail",
    ]);
  });

  it("identifies each handle by its port's id", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(handles(container, "source").map((handle) => handle.dataset["handleid"])).toStrictEqual([
      "pass",
      "fail",
    ]);
  });

  it.each([
    { direction: "down", kind: "target", side: "top" },
    { direction: "down", kind: "source", side: "bottom" },
    { direction: "right", kind: "target", side: "left" },
    { direction: "right", kind: "source", side: "right" },
  ] as const)(
    "puts the $kind ports on the $side side while the graph runs $direction",
    async ({ direction, kind, side }) => {
      const { container } = await drawn({ edges: [], nodes: JUDGE }, null, { direction });

      expect(handles(container, kind)[0]?.dataset["handlepos"]).toBe(side);
    },
  );

  it("takes new connections on an editable canvas", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(handles(container, "target")[0]?.classList).toContain("connectable");
  });

  it("takes no new connection on a read-only canvas", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE, readOnly: true });

    expect(handles(container, "target")[0]?.classList).not.toContain("connectable");
  });

  it("takes no new connection on a disabled port", async () => {
    const nodes = judge({ inputs: [{ disabled: true, id: "in", label: "In" }], label: "Judge" });
    const { container } = await drawn({ edges: [], nodes });

    expect(handles(container, "target")[0]?.classList).not.toContain("connectable");
  });

  it("starts a connection from a port that takes connections", async () => {
    const onConnectStart = vi.fn<NonNullable<Graph.CanvasProps["onConnectStart"]>>();
    const { container } = await drawn({ edges: [], nodes: JUDGE, onConnectStart });

    pressed(handles(container, "source")[0]);

    expect(onConnectStart.mock.lastCall?.[1]).toStrictEqual({
      handleId: "pass",
      handleType: "source",
      nodeId: "judge",
    });
  });

  it("marks an unused port with data-unused", async () => {
    const nodes = judge({ inputs: [{ id: "in", label: "In", unused: true }], label: "Judge" });
    const { container } = await drawn({ edges: [], nodes });

    expect(handles(container, "target")[0]?.dataset["unused"]).toBe("");
  });

  it("marks no port unused by default", async () => {
    const { container } = await drawn({ edges: [], nodes: JUDGE });

    expect(handles(container, "source").map((handle) => handle.dataset["unused"])).toStrictEqual([
      undefined,
      undefined,
    ]);
  });

  it("starts no connection from a disabled port", async () => {
    const onConnectStart = vi.fn<NonNullable<Graph.CanvasProps["onConnectStart"]>>();
    const nodes = judge({
      label: "Judge",
      outputs: [{ disabled: true, id: "pass", label: "Pass" }],
    });
    const { container } = await drawn({ edges: [], nodes, onConnectStart });

    pressed(handles(container, "source")[0]);

    expect(onConnectStart).not.toHaveBeenCalled();
  });
});
