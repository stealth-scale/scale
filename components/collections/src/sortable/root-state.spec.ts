import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type SortableItem, type SortableItems, type SortableMove } from "#sortable/moves.ts";
import { type Root, type RootInput, useRoot } from "#sortable/root-state.ts";
import {
  COLUMNS,
  overOf,
  sourceWith,
  STAGES,
  startOf,
  targetWith,
} from "#sortable/sortable.fixtures.tsx";

function rooted(
  input: Partial<RootInput<SortableItems>> = {},
): RenderHookResult<Root, RootInput<SortableItems>> {
  return renderHook((props: RootInput<SortableItems>) => useRoot(props), {
    initialProps: { items: COLUMNS, words: {}, ...input },
  });
}

function framed(): Promise<number> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

describe("useRoot", () => {
  it("applies the English words when the caller states none", () => {
    const { result } = rooted();

    expect(result.current.state.words.handleLabel("Draft")).toBe("Move Draft");
  });

  it("applies the caller's words over the English ones", () => {
    const { result } = rooted({ words: { roleDescription: "sortierbar" } });

    expect(result.current.state.words.roleDescription).toBe("sortierbar");
  });

  it("keeps its plugins across renders", () => {
    const { rerender, result } = rooted();
    const { plugins } = result.current;

    rerender({ items: STAGES, words: {} });

    expect(result.current.plugins).toBe(plugins);
  });

  it("keeps its registries across renders", () => {
    const { rerender, result } = rooted();
    const { lists, names } = result.current.state;

    rerender({ items: STAGES, words: {} });

    expect(result.current.state.lists).toBe(lists);
    expect(result.current.state.names).toBe(names);
  });

  it("returns true from a move without a drag that a list takes", () => {
    const { result } = rooted({ items: STAGES });

    expect(result.current.state.move("draft", { index: 2 })).toBe(true);
  });

  it("reports the items after a move without a drag", () => {
    const onItemsChange = vi.fn<(items: SortableItems) => void>();
    const { result } = rooted({ items: STAGES, onItemsChange });

    result.current.state.move("draft", { index: 2 });

    expect(onItemsChange.mock.lastCall).toStrictEqual([
      [{ id: "review" }, { id: "publish" }, { id: "draft" }],
    ]);
  });

  it("reports a move without a drag once through onItemMove", () => {
    const onItemMove = vi.fn<(move: SortableMove) => void>();
    const { result } = rooted({ items: STAGES, onItemMove });

    result.current.state.move("draft", { index: 2 });

    expect(onItemMove.mock.calls).toStrictEqual([
      [{ from: { index: 0 }, id: "draft", to: { index: 2 } }],
    ]);
  });

  it("announces a move without a drag in the polite live region", async () => {
    const { result } = rooted({ items: STAGES });

    await framed();
    result.current.state.names.set("draft", "Draft the notes");
    result.current.state.move("draft", { index: 2 });
    await framed();

    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe(
      "Moved Draft the notes to position 3 of 3.",
    );
  });

  it("returns false from a move into a list at its limit", () => {
    const { result } = rooted();

    result.current.state.lists.set("doing", { label: "In progress", limit: 1 });

    expect(result.current.state.move("spec", { index: 0, list: "doing" })).toBe(false);
  });

  it("reports no items for a move into a list at its limit", () => {
    const onItemsChange = vi.fn<(items: SortableItems) => void>();
    const { result } = rooted({ onItemsChange });

    result.current.state.lists.set("doing", { label: "In progress", limit: 1 });
    result.current.state.move("spec", { index: 0, list: "doing" });

    expect(onItemsChange).not.toHaveBeenCalled();
  });

  it("returns false from a move of an item no list contains", () => {
    const { result } = rooted();

    expect(result.current.state.move("gone", { index: 0 })).toBe(false);
  });

  it("returns false from a move the caller's canMove refuses", () => {
    const { result } = rooted({ canMove: () => false });

    expect(result.current.state.move("spec", { index: 0, list: "done" })).toBe(false);
  });

  it("passes canMove the item with the list it leaves and the list it enters", () => {
    const canMove = vi.fn<(item: SortableItem, from: string, to: string) => boolean>(() => true);
    const { result } = rooted({ canMove });

    result.current.state.move("spec", { index: 0, list: "done" });

    expect(canMove.mock.lastCall).toStrictEqual([{ id: "spec" }, "todo", "done"]);
  });

  it("marks the list that refuses the dragged item as refusing", () => {
    const { result } = rooted({ canMove: () => false });
    const source = sourceWith({ group: "todo", id: "spec", index: 0 });
    const target = targetWith({ id: "done", type: "list" });

    act(() => {
      result.current.handlers.onDragStart(startOf(source));
      result.current.handlers.onDragOver(overOf(source, target).event);
    });

    expect(result.current.state.refusing).toBe("done");
  });
});
