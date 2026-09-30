import { describe, expect, it } from "vitest";

import { toaster } from "#toast/examples/toaster.ts";

describe("toaster", () => {
  it("raises into the bottom end of the window", () => {
    expect(toaster.attrs.placement).toBe("bottom-end");
  });

  it("shows five toasts at a time", () => {
    expect(toaster.attrs.max).toBe(5);
  });
});
