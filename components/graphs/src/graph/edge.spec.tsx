import { act, fireEvent } from "@testing-library/react";
import { type Edge as FlowEdge, MarkerType } from "@xyflow/react";
import { XIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { drawn, settled } from "#graph/graph.fixtures.tsx";
import type * as Graph from "#graph/index.ts";

const REMOVABLE: FlowEdge[] = [
  {
    data: { removeLabel: "Remove Orders to Clean orders" },
    id: "orders-clean",
    source: "orders",
    target: "clean",
  },
];

const GLYPH = <XIcon />;

describe("Edge", () => {
  it("renders a remove control named by removeLabel while the canvas takes edits", async () => {
    const { getByRole } = await drawn({ edges: REMOVABLE, removeGlyph: GLYPH });

    expect(getByRole("button", { name: "Remove Orders to Clean orders" })).toBeDefined();
  });

  it("renders the remove glyph in the control", async () => {
    const { getByRole } = await drawn({ edges: REMOVABLE, removeGlyph: GLYPH });

    expect(
      getByRole("button", { name: "Remove Orders to Clean orders" }).querySelector("svg"),
    ).not.toBeNull();
  });

  it("renders no remove control on a read-only canvas", async () => {
    const { queryByRole } = await drawn({ edges: REMOVABLE, readOnly: true, removeGlyph: GLYPH });

    expect(queryByRole("button", { name: "Remove Orders to Clean orders" })).toBeNull();
  });

  it("renders no remove control without a remove glyph", async () => {
    const { queryByRole } = await drawn({ edges: REMOVABLE });

    expect(queryByRole("button", { name: "Remove Orders to Clean orders" })).toBeNull();
  });

  it("names the remove control by the names of its ends without a removeLabel", async () => {
    const { getByRole } = await drawn({ removeGlyph: GLYPH });

    expect(
      getByRole("button", { name: "Remove the connection from Orders to Clean orders" }),
    ).toBeDefined();
  });

  it("names the remove control in the canvas's removeName words", async () => {
    const { getByRole } = await drawn({
      removeGlyph: GLYPH,
      removeName: ({ source, target }) => `Unlink ${source} from ${target}`,
    });

    expect(getByRole("button", { name: "Unlink Clean orders from Revenue" })).toBeDefined();
  });

  it("names an end without a label by its id", async () => {
    const { getByRole } = await drawn({
      nodes: [
        { data: {}, id: "orders", position: { x: 0, y: 0 } },
        { data: { label: "Clean orders" }, id: "clean", position: { x: 0, y: 120 } },
      ],
      removeGlyph: GLYPH,
    });

    expect(
      getByRole("button", { name: "Remove the connection from orders to Clean orders" }),
    ).toBeDefined();
  });

  it("renders no remove control on an edge that is not deletable", async () => {
    const { queryByRole } = await drawn({
      edges: [{ deletable: false, id: "orders-clean", source: "orders", target: "clean" }],
      removeGlyph: GLYPH,
    });

    expect(queryByRole("button", { name: /^Remove/u })).toBeNull();
  });

  it("removes the edge through onEdgesDelete when the control is pressed", async () => {
    const onEdgesDelete = vi.fn<NonNullable<Graph.CanvasProps["onEdgesDelete"]>>();
    const { getByRole } = await drawn({ edges: REMOVABLE, onEdgesDelete, removeGlyph: GLYPH });

    fireEvent.click(getByRole("button", { name: "Remove Orders to Clean orders" }));
    await settled();

    expect(onEdgesDelete.mock.lastCall?.[0].map((edge) => edge.id)).toStrictEqual(["orders-clean"]);
  });

  it("moves focus to the node the edge left once the edge is removed", async () => {
    const { container, getByRole } = await drawn({ edges: REMOVABLE, removeGlyph: GLYPH });
    const control = getByRole("button", { name: "Remove Orders to Clean orders" });

    act(() => {
      control.focus();
    });
    fireEvent.click(control);
    await settled();

    expect(document.activeElement).toBe(
      container.querySelector('.react-flow__node[data-id="orders"]'),
    );
  });

  it("keeps focus on the control when the removal is refused", async () => {
    const { getByRole } = await drawn({
      edges: REMOVABLE,
      onBeforeDelete: () => Promise.resolve(false),
      removeGlyph: GLYPH,
    });
    const control = getByRole("button", { name: "Remove Orders to Clean orders" });

    act(() => {
      control.focus();
    });
    fireEvent.click(control);
    await settled();

    expect(document.activeElement).toBe(control);
  });

  it("places the remove control at the middle of its edge", async () => {
    const { container } = await drawn({ edges: REMOVABLE, removeGlyph: GLYPH });
    const { style } = slotElement(container, "graph", "remove");

    expect([
      style.getPropertyValue("--graph-edge-x"),
      style.getPropertyValue("--graph-edge-y"),
    ]).toStrictEqual(["128px", "86px"]);
  });

  it("keeps the remove control off React Flow's drag surface", async () => {
    const { container } = await drawn({ edges: REMOVABLE, removeGlyph: GLYPH });

    expect([...slotElement(container, "graph", "remove").classList]).toStrictEqual(
      expect.arrayContaining(["nodrag", "nopan"]),
    );
  });

  it("passes the edge's end marker to its path", async () => {
    const { container } = await drawn({
      edges: [
        {
          id: "orders-clean",
          markerEnd: { type: MarkerType.ArrowClosed },
          source: "orders",
          target: "clean",
        },
      ],
    });

    expect(container.querySelector(".react-flow__edge-path")?.getAttribute("marker-end")).toMatch(
      /^url\('#\w+__type=arrowclosed'\)$/u,
    );
  });

  it("passes the edge's start marker to its path", async () => {
    const { container } = await drawn({
      edges: [
        {
          id: "orders-clean",
          markerStart: { type: MarkerType.Arrow },
          source: "orders",
          target: "clean",
        },
      ],
    });

    expect(container.querySelector(".react-flow__edge-path")?.getAttribute("marker-start")).toMatch(
      /^url\('#\w+__type=arrow'\)$/u,
    );
  });
});
