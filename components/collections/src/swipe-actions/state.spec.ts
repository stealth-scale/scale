import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSwipe } from "#swipe-actions/state.ts";

describe("useSwipe", () => {
  it("throws outside a root", () => {
    vi.spyOn(console, "error").mockReturnValue();

    expect(() => renderHook(() => useSwipe())).toThrow(
      "A part of SwipeActions was drawn outside the root that holds it together.",
    );
  });
});
