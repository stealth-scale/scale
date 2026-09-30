import { describe, expect, it } from "vitest";

import { FLOW } from "#graph/flow.ts";

describe("flow", () => {
  it("strokes an edge in the muted ink a hairline wide times its strength", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge-path": {
        fill: "none",
        stroke: "fg.muted",
        strokeWidth: "calc({borderWidths.hairline} * var(--graph-strength, 1))",
      },
    });
  });

  it("strokes a selected or focused edge in the focus ink twice as wide", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge:is(.selected, :focus-visible) .react-flow__edge-path": {
        stroke: "border.focus",
        strokeWidth: "ring",
      },
    });
  });

  it("strokes an edge on a traced path in the ink a ring wide times its strength", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge[data-trace=on] .react-flow__edge-path": {
        stroke: "fg",
        strokeWidth: "calc({borderWidths.ring} * var(--graph-strength, 1))",
      },
    });
  });

  it("strokes an edge on a traced path in CanvasText under forced colors", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge[data-trace=on] .react-flow__edge-path": {
        _highContrast: { stroke: "CanvasText" },
      },
    });
  });

  it("strokes an added edge in the success ink a ring wide times its strength", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge[data-change=added] .react-flow__edge-path": {
        stroke: "border.success",
        strokeWidth: "calc({borderWidths.ring} * var(--graph-strength, 1))",
      },
    });
  });

  it("strokes a removed edge in the error ink dashed", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge[data-change=removed] .react-flow__edge-path": {
        stroke: "border.error",
        strokeDasharray: "{spacing.1.5} {spacing.1}",
      },
    });
  });

  it.each(["added", "removed"])("strokes a $0 edge in CanvasText under forced colors", (change) => {
    expect(FLOW).toMatchObject({
      [`& .react-flow__edge[data-change=${change}] .react-flow__edge-path`]: {
        _highContrast: { stroke: "CanvasText" },
      },
    });
  });

  it("fades an unchanged edge to the backdrop opacity", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge[data-change=unchanged]": { opacity: "backdrop" },
    });
  });

  it("fades an edge off a traced path to the backdrop opacity", () => {
    expect(FLOW).toMatchObject({ "& .react-flow__edge[data-trace=off]": { opacity: "backdrop" } });
  });

  it("hides the viewport while React Flow's element has data-placing", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow[data-placing] .react-flow__viewport": { visibility: "hidden" },
    });
  });

  it("strokes the edges in CanvasText under forced colors", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge-path": { _highContrast: { stroke: "CanvasText" } },
    });
  });

  it("strokes a selected edge in Highlight under forced colors", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__edge:is(.selected, :focus-visible) .react-flow__edge-path": {
        _highContrast: { stroke: "Highlight" },
      },
    });
  });

  it("paints a handle as a muted dot inside a ring in the panel's color", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__handle": {
        background: "fg.muted",
        borderColor: "bg.panel",
        borderRadius: "full",
        borderWidth: "ring",
        boxSize: "2.5",
      },
    });
  });

  it("paints a handle that takes connections in the focus ink", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__handle.connectable": { background: "border.focus", pointerEvents: "all" },
    });
  });

  it("paints a handle that takes connections in Highlight under forced colors", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__handle.connectable": { _highContrast: { background: "Highlight" } },
    });
  });

  it("hides a handle no edge meets while React Flow still measures it", () => {
    expect(FLOW).toMatchObject({ "& .react-flow__handle[data-unused]": { visibility: "hidden" } });
  });

  it("lets the pointer pass through a handle that takes no connections", () => {
    expect(FLOW).toMatchObject({ "& .react-flow__handle": { pointerEvents: "none" } });
  });

  it.each(["top", "bottom"])("spreads the handles of the %s side along it", (side) => {
    expect(FLOW).toMatchObject({
      [`& .react-flow__handle-${side}`]: { left: "var(--graph-port-along, 50%)" },
    });
  });

  it.each(["left", "right"])("spreads the handles of the %s side along it", (side) => {
    expect(FLOW).toMatchObject({
      [`& .react-flow__handle-${side}`]: { top: "var(--graph-port-along, 50%)" },
    });
  });

  it("rings a focused node outside its card", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__node": { focusRingColor: "border.focus", focusVisibleRing: "outside" },
    });
  });

  it("keeps React Flow's order of its layers", () => {
    expect(
      [
        "& .react-flow__pane",
        "& .react-flow__viewport",
        "& .react-flow__renderer",
        "& .react-flow__panel",
        "& .react-flow__selection",
      ].map((layer) => Number(Reflect.get(Reflect.get(FLOW, layer) as object, "zIndex"))),
    ).toStrictEqual([1, 2, 4, 5, 6]);
  });

  it("writes the attribution in the muted ink", () => {
    expect(FLOW).toMatchObject({ "& .react-flow__attribution a": { color: "fg.muted" } });
  });

  it("paints the background's dots in the border ink", () => {
    expect(FLOW).toMatchObject({ "& .react-flow__background-pattern.dots": { fill: "border" } });
  });

  it("paints the background's dots in GrayText under forced colors", () => {
    expect(FLOW).toMatchObject({
      "& .react-flow__background-pattern.dots": { _highContrast: { fill: "GrayText" } },
    });
  });
});
