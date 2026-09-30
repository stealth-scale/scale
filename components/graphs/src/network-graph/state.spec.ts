import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LINKS, NODES } from "#network-graph/network-graph.fixtures.tsx";
import { type Linked, type LinkedProps, useLinked } from "#network-graph/state.ts";
import { WORDS } from "#network-graph/words.ts";

interface Hooked {
  readonly rerender: (props: Partial<LinkedProps>) => void;
  readonly result: { readonly current: Linked };
}

const SIZE = { height: 80, width: 72 };

const BASE: LinkedProps = {
  draggable: true,
  label: "Service topology",
  links: LINKS,
  nodes: NODES,
  words: WORDS,
};

function linked(props: Partial<LinkedProps> = {}): Hooked {
  return renderHook(
    (changed: Partial<LinkedProps>) => useLinked({ ...BASE, ...props, ...changed }),
    {
      initialProps: {},
    },
  );
}

function measured(result: Hooked["result"]): void {
  act(() => {
    result.current.onNodesChange(
      NODES.map((node) => ({ dimensions: SIZE, id: node.id, type: "dimensions" as const })),
    );
  });
}

function moved(result: Hooked["result"]): void {
  act(() => {
    result.current.onNodesChange([
      { dragging: true, id: "fax", position: { x: 400, y: -300 }, type: "position" },
    ]);
  });
}

function positionOf(nodes: Linked["nodes"], id: string): unknown {
  return nodes.find((node) => node.id === id)?.position;
}

describe("state", () => {
  it("starts with no focus", () => {
    expect(linked().result.current.view.connections).toBeUndefined();
  });

  it("starts focused on defaultFocus", () => {
    expect(linked({ defaultFocus: "checkout" }).result.current.view.connections?.name).toBe(
      "Checkout",
    );
  });

  it("focuses the node a selection change selects", () => {
    const { result } = linked();

    act(() => {
      result.current.onNodesChange([{ id: "kafka", selected: true, type: "select" }]);
    });

    expect(result.current.view.connections?.name).toBe("Kafka");
  });

  it("clears the focus when the changes only clear the selection", () => {
    const { result } = linked({ defaultFocus: "checkout" });

    act(() => {
      result.current.onNodesChange([{ id: "checkout", selected: false, type: "select" }]);
    });

    expect(result.current.view.connections).toBeUndefined();
  });

  it("keeps the focus when the changes select nothing", () => {
    const { result } = linked({ defaultFocus: "checkout" });

    measured(result);

    expect(result.current.view.connections?.name).toBe("Checkout");
  });

  it("clears the focus through clear", () => {
    const { result } = linked({ defaultFocus: "checkout" });

    act(() => {
      result.current.clear();
    });

    expect(result.current.view.connections).toBeUndefined();
  });

  it("calls onFocusChange with the focused node's id", () => {
    const onFocusChange = vi.fn<(id: null | string) => void>();
    const { result } = linked({ onFocusChange });

    act(() => {
      result.current.onNodesChange([{ id: "kafka", selected: true, type: "select" }]);
    });

    expect(onFocusChange.mock.lastCall).toStrictEqual(["kafka"]);
  });

  it("follows a controlled focus", () => {
    expect(linked({ focus: "ledger" }).result.current.view.connections?.name).toBe("Ledger");
  });

  it("counts the nodes one hop away unless depth is stated", () => {
    expect(linked({ defaultFocus: "checkout" }).result.current.view.connections?.count).toBe(3);
  });

  it("counts the nodes within the hops depth states", () => {
    const { result } = linked({ defaultFocus: "checkout", depth: 2 });

    expect(result.current.view.connections?.count).toBe(5);
  });

  it("places every node apart before React Flow measures any", () => {
    const positions = linked().result.current.nodes.map(({ position }) => JSON.stringify(position));

    expect(new Set(positions).size).toBe(NODES.length);
  });

  it("reports the view incomplete until React Flow has measured every node", () => {
    expect(linked().result.current.view.complete).toBe(false);
  });

  it("reports the view complete once React Flow has measured every node", () => {
    const { result } = linked();

    measured(result);

    expect(result.current.view.complete).toBe(true);
  });

  it("keeps every position when React Flow measures the nodes", () => {
    const { result } = linked();
    const before = result.current.nodes.map(({ position }) => position);

    measured(result);

    expect(result.current.nodes.map(({ position }) => position)).toStrictEqual(before);
  });

  it("passes each measured size back to React Flow with its node", () => {
    const { result } = linked();

    measured(result);

    expect(result.current.nodes.map((node) => node.measured)).toStrictEqual(NODES.map(() => SIZE));
  });

  it("weighs a node without a weight by the links the canvas renders", () => {
    const { result } = linked({
      links: [
        { source: "fax", target: "fax" },
        { source: "fax", target: "ghost" },
        { source: "sms", target: "fax" },
      ],
      nodes: [
        { id: "fax", label: "Fax" },
        { id: "sms", label: "SMS" },
      ],
    });

    expect(result.current.nodes.map(({ data }) => data.disc)).toStrictEqual([68, 68]);
  });

  it("places the nodes another way for another seed", () => {
    expect(positionOf(linked({ seed: 7 }).result.current.nodes, "fax")).not.toStrictEqual(
      positionOf(linked().result.current.nodes, "fax"),
    );
  });

  it("runs the number of layout steps stated", () => {
    expect(positionOf(linked({ iterations: 1 }).result.current.nodes, "fax")).not.toStrictEqual(
      positionOf(linked().result.current.nodes, "fax"),
    );
  });

  it("renders a moved node where a person moved it", () => {
    const { result } = linked();

    moved(result);

    expect(positionOf(result.current.nodes, "fax")).toStrictEqual({ x: 400, y: -300 });
  });

  it("reports a moved node's id", () => {
    const { result } = linked();

    moved(result);

    expect([...result.current.moved]).toStrictEqual(["fax"]);
  });

  it("keeps a moved node where the layout put it in the view", () => {
    const { result } = linked();
    const laid = positionOf(result.current.view.nodes, "fax");

    moved(result);

    expect(positionOf(result.current.view.nodes, "fax")).toStrictEqual(laid);
  });

  it("keeps a moved node where a person moved it when the changes move nothing", () => {
    const { result } = linked();

    moved(result);
    act(() => {
      result.current.onNodesChange([{ id: "kafka", selected: true, type: "select" }]);
    });

    expect(positionOf(result.current.nodes, "fax")).toStrictEqual({ x: 400, y: -300 });
  });

  it("keeps a moved node where a person moved it when React Flow measures the nodes", () => {
    const { result } = linked();

    moved(result);
    measured(result);

    expect(positionOf(result.current.nodes, "fax")).toStrictEqual({ x: 400, y: -300 });
  });

  it("keeps every move a person made on one layout", () => {
    const { result } = linked();

    moved(result);
    act(() => {
      result.current.onNodesChange([{ id: "kafka", position: { x: 1, y: 2 }, type: "position" }]);
    });

    expect([...result.current.moved].toSorted()).toStrictEqual(["fax", "kafka"]);
  });

  it("puts a moved node back where the layout puts it when the layout changes", () => {
    const { rerender, result } = linked();

    moved(result);
    rerender({ seed: 7 });

    expect(positionOf(result.current.nodes, "fax")).toStrictEqual(
      positionOf(result.current.view.nodes, "fax"),
    );
  });

  it("renders at most once more for repeated changes that change no state", () => {
    let renders = 0;
    const { result } = renderHook(() => {
      renders += 1;

      return useLinked(BASE);
    });

    measured(result);

    const before = renders;

    for (const _ of [1, 2, 3, 4]) {
      act(() => {
        result.current.onNodesChange([{ id: "fax", type: "remove" }]);
      });
    }

    expect(renders - before).toBeLessThanOrEqual(1);
  });

  it("starts a new set of moves on a changed layout", () => {
    const { rerender, result } = linked();

    moved(result);
    rerender({ seed: 7 });
    act(() => {
      result.current.onNodesChange([{ id: "kafka", position: { x: 1, y: 2 }, type: "position" }]);
    });

    expect([...result.current.moved]).toStrictEqual(["kafka"]);
  });
});
