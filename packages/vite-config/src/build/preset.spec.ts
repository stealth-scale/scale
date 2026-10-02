import { describe, expect, it } from "vitest";

import { base, web } from "#build/preset.ts";

describe("preset", () => {
  it("includes build.sourcemaps in every group", () => {
    for (const tier of [base(), web()]) {
      expect(tier.map((one) => one.name)).toContain("build.sourcemaps");
    }
  });

  it("omits every layer that assumes a browser target from the base group", () => {
    const held = base()
      .map((one) => one.name)
      .join();

    expect(held).not.toContain("manifest");
    expect(held).not.toContain("preload");
    expect(held).not.toContain("chunks");
  });

  it("includes every layer that assumes a browser target in the web group", () => {
    const held = web().map((one) => one.name);

    expect(held).toContain("build.manifest");
    expect(held).toContain("build.preload");
    expect(held).toContain("build.chunks");
  });

  it("includes build.licences in the web group", () => {
    expect(web().map((one) => one.name)).toContain("build.licences");
  });
});
