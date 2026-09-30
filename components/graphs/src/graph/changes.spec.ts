import { type NodeChange } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { measuredBy, movedBy, selectedBy } from "#graph/changes.ts";

const SIZE = { height: 52, width: 256 };

const MOVED = new Map([["clean", { x: 10, y: 20 }]]);

describe("changes", () => {
  it("returns the node a change selects", () => {
    expect(selectedBy([{ id: "clean", selected: true, type: "select" }])).toBe("clean");
  });

  it("returns the selected node when the change that clears another comes first", () => {
    const changes: NodeChange[] = [
      { id: "orders", selected: false, type: "select" },
      { id: "clean", selected: true, type: "select" },
    ];

    expect(selectedBy(changes)).toBe("clean");
  });

  it("returns null when the changes only clear the selection", () => {
    expect(selectedBy([{ id: "clean", selected: false, type: "select" }])).toBeNull();
  });

  it("returns undefined when no change selects or clears", () => {
    expect(selectedBy([{ dimensions: SIZE, id: "clean", type: "dimensions" }])).toBeUndefined();
  });

  it("records the size a change measured", () => {
    const sizes = measuredBy(new Map(), [{ dimensions: SIZE, id: "clean", type: "dimensions" }]);

    expect(sizes.get("clean")).toStrictEqual(SIZE);
  });

  it("returns the same sizes when a change measured the size already known", () => {
    const sizes = new Map([["clean", SIZE]]);

    expect(measuredBy(sizes, [{ dimensions: SIZE, id: "clean", type: "dimensions" }])).toBe(sizes);
  });

  it("records a height that changed while the width did not", () => {
    const sizes = new Map([["clean", SIZE]]);
    const changed = measuredBy(sizes, [
      { dimensions: { height: 80, width: 256 }, id: "clean", type: "dimensions" },
    ]);

    expect(changed.get("clean")).toStrictEqual({ height: 80, width: 256 });
  });

  it("records a width that changed while the height did not", () => {
    const sizes = new Map([["clean", SIZE]]);
    const changed = measuredBy(sizes, [
      { dimensions: { height: 52, width: 300 }, id: "clean", type: "dimensions" },
    ]);

    expect(changed.get("clean")).toStrictEqual({ height: 52, width: 300 });
  });

  it("returns the same sizes for a dimension change without dimensions", () => {
    const sizes = new Map([["clean", SIZE]]);

    expect(measuredBy(sizes, [{ id: "orders", type: "dimensions" }])).toBe(sizes);
  });

  it("returns the same sizes for a change that measures nothing", () => {
    const sizes = new Map([["clean", SIZE]]);

    expect(measuredBy(sizes, [{ id: "clean", selected: true, type: "select" }])).toBe(sizes);
  });

  it("records the position a change moved a node to", () => {
    const moved = movedBy(new Map(), [
      { dragging: true, id: "clean", position: { x: 40, y: 60 }, type: "position" },
    ]);

    expect(moved.get("clean")).toStrictEqual({ x: 40, y: 60 });
  });

  it("keeps the positions of the nodes a change did not move", () => {
    const moved = movedBy(MOVED, [{ id: "orders", position: { x: 1, y: 2 }, type: "position" }]);

    expect([...moved]).toStrictEqual([
      ["clean", { x: 10, y: 20 }],
      ["orders", { x: 1, y: 2 }],
    ]);
  });

  it("returns the same positions for a position change without a position", () => {
    expect(movedBy(MOVED, [{ dragging: false, id: "clean", type: "position" }])).toBe(MOVED);
  });

  it("returns the same positions for a change that moves nothing", () => {
    expect(movedBy(MOVED, [{ id: "clean", selected: true, type: "select" }])).toBe(MOVED);
  });
});
