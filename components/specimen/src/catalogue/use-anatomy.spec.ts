import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { entry } from "#catalogue/mounted.fixtures.tsx";
import { type Anatomy, type Indexed } from "#catalogue/types.ts";
import { useAnatomy } from "#catalogue/use-anatomy.ts";

/**
 * What one page's components accept, as the reader hands it over.
 */
const ANATOMY: Anatomy = {
  dropped: { ButtonProps: { conditions: 4, foreign: 9 } },
  parts: {
    ButtonProps: [
      {
        accepts: "string",
        fallback: "",
        kind: "option",
        name: "aria-label",
        refers: [],
        required: false,
        says: "",
      },
    ],
  },
  shapes: {},
};

/**
 * Returns an entry whose props load the way a case asks.
 */
function indexed(props?: Indexed["props"]): Indexed {
  return {
    ...entry("actions/button", "Actions", "Button"),
    ...(props === undefined ? {} : { props }),
  };
}

describe("useAnatomy", () => {
  it("reads nothing while nobody is looking at the props", () => {
    const load = vi.fn(() => Promise.resolve(ANATOMY));
    const page = indexed(load);
    const { result } = renderHook(() => useAnatomy(page, false));

    expect(load).not.toHaveBeenCalled();
    expect(result.current.parts).toBeUndefined();
  });

  it("reads the props once a reader looks at them", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.resolve(ANATOMY));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts).toHaveLength(1);
    });
  });

  it("reads the props once and not on every render", async () => {
    expect.hasAssertions();

    const load = vi.fn(() => Promise.resolve(ANATOMY));
    const page = indexed(load);
    const { rerender, result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts).toHaveLength(1);
    });
    rerender();

    expect(load).toHaveBeenCalledTimes(1);
  });

  it("splits each part's props by kind", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.resolve(ANATOMY));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts?.[0]?.options).toHaveLength(1);
    });
  });

  it("answers with no parts at all for a page the index holds no props for", async () => {
    expect.hasAssertions();

    const page = indexed();
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts).toStrictEqual([]);
    });
  });

  it("keeps nothing for a page taken off the screen before the props arrive", async () => {
    const held: { resolve?: (anatomy: Anatomy) => void } = {};
    const pending = new Promise<Anatomy>((resolve) => {
      held.resolve = resolve;
    });
    const page = indexed(() => pending);
    const { result, unmount } = renderHook(() => useAnatomy(page, true));

    unmount();
    held.resolve?.(ANATOMY);
    await pending;
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current.parts).toBeUndefined();
  });

  it("reports why the props failed to load rather than answering with no parts", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.reject(new Error("no props")));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.failure?.message).toBe("no props");
    });

    expect(result.current.parts).toBeUndefined();
  });

  it("reports a rejection that is no error by what it said", async () => {
    expect.hasAssertions();

    // eslint-disable-next-line typescript/prefer-promise-reject-errors -- a loader that fails with something other than an error is what the case covers
    const page = indexed(() => Promise.reject("Failed to fetch"));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.failure?.message).toBe("Failed to fetch");
    });
  });

  it("keeps nothing for a page taken off the screen before the props fail", async () => {
    const held: { reject?: (reason: Error) => void } = {};
    const pending = new Promise<Anatomy>((_, reject) => {
      held.reject = reject;
    });
    const page = indexed(() => pending);
    const { result, unmount } = renderHook(() => useAnatomy(page, true));

    unmount();
    held.reject?.(new Error("gone"));
    await pending.catch(() => {});
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current.failure).toBeUndefined();
  });
});
