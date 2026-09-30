import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CaptionProvider, LabellingProvider, useCaptionId, useLabelled } from "#chart/labelling.ts";

describe("labelling", () => {
  it("returns the ID the root provides for its caption", () => {
    const { result } = renderHook(() => useCaptionId(), {
      wrapper: ({ children }) => <CaptionProvider value="caption-1">{children}</CaptionProvider>,
    });

    expect(result.current).toBe("caption-1");
  });

  it("throws for a caption outside a chart's root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useCaptionId())).toThrow(/Chart\.Root/u);
  });

  it("reports a mounted caption to the root", () => {
    const labelled = vi.fn<(value: boolean) => void>();

    renderHook(
      () => {
        useLabelled();
      },
      {
        wrapper: ({ children }) => (
          <LabellingProvider value={labelled}>{children}</LabellingProvider>
        ),
      },
    );

    expect(labelled).toHaveBeenLastCalledWith(true);
  });

  it("reports an unmounted caption to the root", () => {
    const labelled = vi.fn<(value: boolean) => void>();
    const { unmount } = renderHook(
      () => {
        useLabelled();
      },
      {
        wrapper: ({ children }) => (
          <LabellingProvider value={labelled}>{children}</LabellingProvider>
        ),
      },
    );

    unmount();

    expect(labelled).toHaveBeenLastCalledWith(false);
  });
});
