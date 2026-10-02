import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { reducedMotion } from "#reduced-motion.fixtures.ts";
import { REDUCED_MOTION, useReducedMotion } from "#reduced-motion.ts";

describe("useReducedMotion", () => {
  it("returns false while the reader allows motion", () => {
    reducedMotion(false);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });

  it("returns true while the reader asks for reduced motion", () => {
    reducedMotion(true);

    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
  });

  it("returns the new setting when the reader changes it", () => {
    const setting = reducedMotion(false);
    const { result } = renderHook(() => useReducedMotion());

    act(() => {
      setting.change(true);
    });

    expect(result.current).toBe(true);
  });

  it("stops listening when the component unmounts", () => {
    const setting = reducedMotion(false);
    const { result, unmount } = renderHook(() => useReducedMotion());

    unmount();
    setting.change(true);

    expect(result.current).toBe(false);
  });

  it("reads the prefers-reduced-motion query", () => {
    expect(REDUCED_MOTION).toBe("(prefers-reduced-motion: reduce)");
  });
});
