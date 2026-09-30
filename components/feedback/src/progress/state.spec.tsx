import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LabellingProvider, useLabelling } from "#progress/state.ts";

describe("state", () => {
  it("returns the state the root provides from useLabelling", () => {
    const provided = {
      id: "progress-ada-label",
      labelled: true,
      setLabelled: vi.fn<(labelled: boolean) => void>(),
    };
    const { result } = renderHook(() => useLabelling(), {
      wrapper: ({ children }) => <LabellingProvider value={provided}>{children}</LabellingProvider>,
    });

    expect(result.current).toBe(provided);
  });
});
