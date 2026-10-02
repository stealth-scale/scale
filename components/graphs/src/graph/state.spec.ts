import { use } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RemovalContext, useGraphDirection } from "#graph/state.ts";

describe("state", () => {
  it("returns down as the direction outside a root", () => {
    expect(renderHook(() => useGraphDirection()).result.current).toBe("down");
  });

  it("provides no remove glyph outside a canvas", () => {
    expect(renderHook(() => use(RemovalContext)).result.current.glyph).toBeUndefined();
  });

  it("turns the remove control off outside a canvas", () => {
    expect(renderHook(() => use(RemovalContext)).result.current.editable).toBe(false);
  });

  it("names a remove control in English outside a canvas", () => {
    expect(
      renderHook(() => use(RemovalContext)).result.current.name({ source: "A", target: "B" }),
    ).toBe("Remove the connection from A to B");
  });
});
