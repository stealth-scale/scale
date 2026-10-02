import { renderHook } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { signatureOf, usePlaced } from "#graph/placed.ts";

const NODES = [
  { data: {}, id: "orders", position: { x: 0, y: 0 } },
  { data: {}, id: "clean", position: { x: 10, y: 180 } },
];

const ACROSS = [
  { data: {}, id: "orders", position: { x: 0, y: 0 } },
  { data: {}, id: "clean", position: { x: 11, y: 180 } },
];

const DOWN = [
  { data: {}, id: "orders", position: { x: 0, y: 0 } },
  { data: {}, id: "clean", position: { x: 10, y: 181 } },
];

describe("placed", () => {
  it("returns each node's id and position in order", () => {
    expect(signatureOf(NODES)).toBe("orders:0,0;clean:10,180");
  });

  it("returns another string when a node moves across", () => {
    expect(signatureOf(ACROSS)).not.toBe(signatureOf(NODES));
  });

  it("returns another string when a node moves down", () => {
    expect(signatureOf(DOWN)).not.toBe(signatureOf(NODES));
  });

  it("returns an empty string for no node", () => {
    expect(signatureOf([])).toBe("");
  });

  it("reports placing while a node is unmeasured", () => {
    const { result } = renderHook(() => usePlaced([], false), { wrapper: ReactFlowProvider });

    expect(result.current).toBe(true);
  });

  it("reports placing while React Flow's store has the nodes elsewhere", () => {
    const { result } = renderHook(() => usePlaced(NODES, true), { wrapper: ReactFlowProvider });

    expect(result.current).toBe(true);
  });

  it("reports placed once React Flow's store has the nodes where the layout put them", () => {
    const { result } = renderHook(() => usePlaced([], true), { wrapper: ReactFlowProvider });

    expect(result.current).toBe(false);
  });

  it("reports placed while only the nodes a person moved differ from the store", () => {
    const moved = new Set(["orders", "clean"]);
    const { result } = renderHook(() => usePlaced(NODES, true, moved), {
      wrapper: ReactFlowProvider,
    });

    expect(result.current).toBe(false);
  });

  it("reports placing while a node nobody moved differs from the store", () => {
    const moved = new Set(["orders"]);
    const { result } = renderHook(() => usePlaced(NODES, true, moved), {
      wrapper: ReactFlowProvider,
    });

    expect(result.current).toBe(true);
  });
});
