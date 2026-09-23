import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { entry } from "#catalogue/mounted.fixtures.tsx";
import { type Anatomy, type Indexed } from "#catalogue/types.ts";
import { useAnatomy } from "#catalogue/use-anatomy.ts";

/**
 * Anatomy of one page in the shape the props loader resolves.
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
 * Returns a page entry with the given props loader and a title key.
 */
function indexed(props?: Indexed["props"]): Indexed {
  return {
    ...entry("actions/button", "Actions", "button.title"),
    ...(props === undefined ? {} : { props }),
  };
}

describe("useAnatomy", () => {
  it("calls no loader when wanted is false", () => {
    const load = vi.fn(() => Promise.resolve(ANATOMY));
    const page = indexed(load);

    renderHook(() => useAnatomy(page, false));

    expect(load).not.toHaveBeenCalled();
  });

  it("returns no parts when wanted is false", () => {
    const page = indexed(() => Promise.resolve(ANATOMY));
    const { result } = renderHook(() => useAnatomy(page, false));

    expect(result.current.parts).toBeUndefined();
  });

  it("returns the parts when wanted is true", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.resolve(ANATOMY));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts).toHaveLength(1);
    });
  });

  it("calls the loader once across rerenders", async () => {
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

  it("names each part after the page ID instead of the title key", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.resolve(ANATOMY));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts?.[0]?.component).toBe("Button");
    });
  });

  it("returns an empty array when the entry has no props loader", async () => {
    expect.hasAssertions();

    const page = indexed();
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.parts).toStrictEqual([]);
    });
  });

  it("returns no parts when the loader resolves after unmount", async () => {
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

  it("returns the failure when the loader rejects", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.reject(new Error("no props")));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.failure?.message).toBe("no props");
    });
  });

  it("returns no parts when the loader rejects", async () => {
    expect.hasAssertions();

    const page = indexed(() => Promise.reject(new Error("no props")));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.failure).toBeDefined();
    });

    expect(result.current.parts).toBeUndefined();
  });

  it("converts a non-Error rejection into an Error with the value as its message", async () => {
    expect.hasAssertions();

    // eslint-disable-next-line typescript/prefer-promise-reject-errors -- a loader that fails with something other than an error is what the case covers
    const page = indexed(() => Promise.reject("Failed to fetch"));
    const { result } = renderHook(() => useAnatomy(page, true));

    await waitFor(() => {
      expect(result.current.failure?.message).toBe("Failed to fetch");
    });
  });

  it("returns no failure when the loader rejects after unmount", async () => {
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
