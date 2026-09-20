import { describe, expect, it } from "vitest";

import { isSystemColor } from "#system-colors.ts";

describe("isSystemColor", () => {
  it("names the colors a forced-color mode draws a marked thing in", () => {
    expect(isSystemColor("Highlight")).toBe(true);
    expect(isSystemColor("ButtonText")).toBe(true);
    expect(isSystemColor("CanvasText")).toBe(true);
  });

  it("names nothing a theme defines or a reader misspells", () => {
    expect(isSystemColor("highlight")).toBe(false);
    expect(isSystemColor("fg.muted")).toBe(false);
    expect(isSystemColor("white")).toBe(false);
  });
});
