import { type ReactNode, use } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { COLUMNS, inside, rootStateOf } from "#sortable/sortable.fixtures.tsx";
import { ListContext, useItemState, useMove, useRootState } from "#sortable/state.ts";

describe("state", () => {
  it("throws from useRootState outside a root", () => {
    expect(() => renderHook(() => useRootState())).toThrow(
      "A part of Sortable was drawn outside the root that holds it together.",
    );
  });

  it("throws from useItemState outside an item", () => {
    expect(() => renderHook(() => useItemState())).toThrow(
      "A part of Sortable.Item was drawn outside the root that holds it together.",
    );
  });

  it("returns the root's move from useMove", () => {
    const state = rootStateOf(COLUMNS);
    const { result } = renderHook(() => useMove(), {
      wrapper: ({ children }: { readonly children: ReactNode }) => inside(state, children),
    });

    expect(result.current).toBe(state.move);
  });

  it("provides no list outside a list", () => {
    const { result } = renderHook(() => use(ListContext));

    expect(result.current).toBeUndefined();
  });
});
