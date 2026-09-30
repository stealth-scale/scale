import { use } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrollerContext } from "#listbox/scroller.ts";

describe("ScrollerContext", () => {
  it("returns null outside a listbox's content", () => {
    const { result } = renderHook(() => use(ScrollerContext));

    expect(result.current).toBeNull();
  });
});
