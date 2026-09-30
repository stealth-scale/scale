import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGroup } from "#date-input/group.ts";

describe("group", () => {
  it("throws with the segment group's name for a segment outside a group", () => {
    expect(() => renderHook(() => useGroup())).toThrow(
      "A part of DateInput.SegmentGroup was drawn outside the root that holds it together.",
    );
  });
});
