import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { sourcemaps } from "#build/sourcemaps.ts";

describe("sourcemaps", () => {
  it("sets build.sourcemap to a truthy value", () => {
    expect((sourcemaps().config as UserConfig).build?.sourcemap).toBeTruthy();
  });

  it("sets build.sourcemap to hidden", () => {
    expect((sourcemaps().config as UserConfig).build?.sourcemap).toBe("hidden");
  });

  it("names the preset build.sourcemaps", () => {
    expect(sourcemaps().name).toBe("build.sourcemaps");
  });
});
