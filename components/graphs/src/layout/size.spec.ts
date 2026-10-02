import { type Node } from "@xyflow/react";
import { describe, expect, it } from "vitest";

import { SIZE, sizeOf } from "#layout/size.ts";

const NODE: Node = { data: {}, id: "orders", position: { x: 0, y: 0 } };

describe("size", () => {
  it("returns 256 by 44 pixels for a node that states no size", () => {
    expect(sizeOf(NODE)).toStrictEqual({ height: 44, width: 256 });
  });

  it("returns the default size as SIZE", () => {
    expect(SIZE).toStrictEqual({ height: 44, width: 256 });
  });

  it("returns the initial size before the default", () => {
    expect(sizeOf({ ...NODE, initialHeight: 60, initialWidth: 220 })).toStrictEqual({
      height: 60,
      width: 220,
    });
  });

  it("returns the stated size before the initial size", () => {
    const node = { ...NODE, height: 90, initialHeight: 60, initialWidth: 220, width: 200 };

    expect(sizeOf(node)).toStrictEqual({ height: 90, width: 200 });
  });

  it("returns the measured size before the stated size", () => {
    const node = { ...NODE, height: 90, measured: { height: 120, width: 300 }, width: 200 };

    expect(sizeOf(node)).toStrictEqual({ height: 120, width: 300 });
  });

  it("reads each side on its own", () => {
    expect(sizeOf({ ...NODE, width: 200 })).toStrictEqual({ height: 44, width: 200 });
  });
});
