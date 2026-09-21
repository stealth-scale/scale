import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { preload } from "#build/preload.ts";

describe("preload", () => {
  it("sets modulePreload.polyfill to false", () => {
    const held = (preload().config as UserConfig).build?.modulePreload as { polyfill: boolean };

    expect(held.polyfill).toBe(false);
  });

  it("leaves modulePreload enabled", () => {
    expect((preload().config as UserConfig).build?.modulePreload).not.toBe(false);
  });

  it("names the preset build.preload", () => {
    expect(preload().name).toBe("build.preload");
  });
});
