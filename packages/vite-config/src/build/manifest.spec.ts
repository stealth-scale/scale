import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { manifest } from "#build/manifest.ts";

describe("manifest", () => {
  it("sets build.manifest to true", () => {
    expect((manifest().config as UserConfig).build?.manifest).toBe(true);
  });

  it("names the preset build.manifest", () => {
    expect(manifest().name).toBe("build.manifest");
  });
});
