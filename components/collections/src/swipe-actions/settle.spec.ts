import { describe, expect, it } from "vitest";

import { settleSwipe } from "#swipe-actions/settle.ts";

describe("settleSwipe", () => {
  it.each([
    { revealed: 80, want: "open", width: 160 },
    { revealed: 160, want: "open", width: 160 },
    { revealed: 79, want: "closed", width: 160 },
    { revealed: 0, want: "closed", width: 160 },
    { revealed: 10, want: "closed", width: 0 },
  ])("returns $want for $revealed of $width pixels", ({ revealed, want, width }) => {
    expect(settleSwipe(revealed, width)).toBe(want);
  });
});
