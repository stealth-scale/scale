import { use } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrientationContext } from "#scroll-area/orientation.ts";

describe("OrientationContext", () => {
  it("defaults to vertical outside a bar", () => {
    const { result } = renderHook(() => use(OrientationContext));

    expect(result.current).toBe("vertical");
  });
});
