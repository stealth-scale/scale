import { describe, expect, it } from "vitest";

import { isSystemColor } from "#system-colors.ts";

describe("isSystemColor", () => {
  it("returns true for a system color CSS Color 4 defines", () => {
    expect(isSystemColor("Highlight")).toBe(true);
    expect(isSystemColor("ButtonText")).toBe(true);
    expect(isSystemColor("CanvasText")).toBe(true);
  });

  it("returns false for a token name or a misspelled system color", () => {
    expect(isSystemColor("highlight")).toBe(false);
    expect(isSystemColor("fg.muted")).toBe(false);
    expect(isSystemColor("white")).toBe(false);
  });
});
