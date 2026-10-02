import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EDGES, NODES } from "#directed-graph/directed-graph.fixtures.tsx";
import { type Traced, type TracedProps, useToggle, useTraced } from "#directed-graph/state.ts";
import { WORDS } from "#directed-graph/words.ts";

interface Hooked {
  readonly result: { readonly current: Traced };
}

const SIZE = { height: 52, width: 256 };

const BASE: TracedProps = {
  direction: "down",
  edges: EDGES,
  label: "Revenue lineage",
  nodes: NODES,
  words: WORDS,
};

function traced(props: Partial<TracedProps> = {}): Hooked {
  return renderHook(() => useTraced({ ...BASE, ...props }));
}

function measured(result: Hooked["result"]): void {
  act(() => {
    result.current.onNodesChange(
      NODES.map((node) => ({ dimensions: SIZE, id: node.id, type: "dimensions" as const })),
    );
  });
}

function shown(result: Hooked["result"]): string[] {
  return result.current.view.nodes.map((node) => node.id);
}

describe("state", () => {
  it("starts with no focus", () => {
    const { result } = traced();

    expect(result.current.view.counts).toBeUndefined();
  });

  it("starts focused on defaultFocus", () => {
    const { result } = traced({ defaultFocus: "joined" });

    expect(result.current.view.counts?.name).toBe("Joined orders");
  });

  it("focuses the node a selection change selects", () => {
    const { result } = traced();

    act(() => {
      result.current.onNodesChange([{ id: "clean", selected: true, type: "select" }]);
    });

    expect(result.current.view.counts?.name).toBe("Clean orders");
  });

  it("clears the focus when the changes only clear the selection", () => {
    const { result } = traced({ defaultFocus: "joined" });

    act(() => {
      result.current.onNodesChange([{ id: "joined", selected: false, type: "select" }]);
    });

    expect(result.current.view.counts).toBeUndefined();
  });

  it("keeps the focus when the changes select nothing", () => {
    const { result } = traced({ defaultFocus: "joined" });

    measured(result);

    expect(result.current.view.counts?.name).toBe("Joined orders");
  });

  it("clears the focus through clear", () => {
    const { result } = traced({ defaultFocus: "joined" });

    act(() => {
      result.current.clear();
    });

    expect(result.current.view.counts).toBeUndefined();
  });

  it("reports a new focus to onFocusChange", () => {
    const onFocusChange = vi.fn<(id: null | string) => void>();
    const { result } = traced({ onFocusChange });

    act(() => {
      result.current.onNodesChange([{ id: "clean", selected: true, type: "select" }]);
    });

    expect(onFocusChange.mock.lastCall).toStrictEqual(["clean"]);
  });

  it("reports a cleared focus to onFocusChange as null", () => {
    const onFocusChange = vi.fn<(id: null | string) => void>();
    const { result } = traced({ defaultFocus: "joined", onFocusChange });

    act(() => {
      result.current.clear();
    });

    expect(onFocusChange.mock.lastCall).toStrictEqual([null]);
  });

  it("renders the controlled focus", () => {
    const { result } = traced({ defaultFocus: "clean", focus: "joined" });

    expect(result.current.view.counts?.name).toBe("Joined orders");
  });

  it("renders no focus while the controlled focus is null", () => {
    const { result } = traced({ defaultFocus: "joined", focus: null });

    expect(result.current.view.counts).toBeUndefined();
  });

  it("places the nodes once React Flow has measured every node", () => {
    const { result } = traced();

    measured(result);

    expect(result.current.view.complete).toBe(true);
  });

  it("closes the branch the toggle names", () => {
    const { result } = traced({ collapsible: true });

    measured(result);
    act(() => {
      result.current.toggle("joined");
    });

    expect(shown(result)).not.toContain("revenue");
  });

  it("opens the closed branch the toggle names", () => {
    const { result } = traced({ collapsible: true, defaultCollapsed: ["joined"] });

    measured(result);
    act(() => {
      result.current.toggle("joined");
    });

    expect(shown(result)).toContain("revenue");
  });

  it("reports the closed branches to onCollapsedChange", () => {
    const onCollapsedChange = vi.fn<(ids: string[]) => void>();
    const { result } = traced({ collapsible: true, onCollapsedChange });

    act(() => {
      result.current.toggle("joined");
    });

    expect(onCollapsedChange.mock.lastCall).toStrictEqual([["joined"]]);
  });

  it("renders the controlled closed branches", () => {
    const { result } = traced({ collapsed: ["joined"], collapsible: true });

    measured(result);

    expect(shown(result)).not.toContain("revenue");
  });

  it("highlights by default", () => {
    const { result } = traced({ defaultFocus: "joined" });

    measured(result);

    expect(result.current.view.nodes.find((node) => node.id === "logs")?.data.dimmed).toBe(true);
  });

  it("traces every hop by default", () => {
    const { result } = traced({ defaultFocus: "joined" });

    expect(result.current.view.counts?.upstream).toBe(3);
  });

  it("follows the depth it is given", () => {
    const { result } = traced({ defaultFocus: "joined", depth: 1 });

    expect(result.current.view.counts?.upstream).toBe(2);
  });

  it("isolates the trace it is given", () => {
    const { result } = traced({ defaultFocus: "joined", trace: "isolate" });

    measured(result);

    expect(shown(result)).not.toContain("logs");
  });

  it("lays the nodes out in the direction it is given", () => {
    const { result } = traced({ direction: "right" });

    measured(result);

    expect(result.current.view.nodes.find((node) => node.id === "clean")?.position.x).toBe(384);
  });

  it("throws when a card reads the toggle outside the graph", () => {
    expect(() => renderHook(() => useToggle())).toThrow("DirectedGraph");
  });
});
