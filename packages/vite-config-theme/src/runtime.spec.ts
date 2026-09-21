/**
 * Covers the layers the system package extends its tier with.
 */

import { describe, expect, it } from "vitest";

import { type Context, type Contribution, type Override } from "@stealthscale/vite-config-core";

import { runtime } from "#runtime.ts";

const PACKING: Context = {
  at: "/repository/foundations/theme",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

function contributed(): Contribution {
  const [held] = runtime();

  if (held === undefined || held.kind !== "contribution") throw new Error("not a contribution");

  return held;
}

function overriding(): Override {
  const [, held] = runtime();

  if (held === undefined || held.kind !== "override") throw new Error("not an override");

  return held;
}

function item(): Promise<unknown> {
  return Promise.resolve(contributed().itemOf?.(PACKING));
}

function packed(composed = {}): Promise<unknown> {
  const refined = overriding().refine(PACKING, composed);
  const plugins: unknown = Array.isArray(refined.pack) ? undefined : refined.pack?.plugins;

  return Promise.resolve(Array.isArray(plugins) ? plugins.at(-1) : undefined);
}

describe("runtime", () => {
  it("appends to the list of plugins rather than replacing whatever else is there", () => {
    expect(contributed().at).toBe("plugins");
  });

  it("names the layers for the call a consumer wrote", () => {
    expect(runtime().map((layer) => layer.name)).toStrictEqual([
      "theme.runtime",
      "theme.runtime(pack)",
    ]);
  });

  it("carries the runtime plugin under its house name", async () => {
    await expect(item()).resolves.toMatchObject({ name: "stealth:theme.runtime" });
  });

  it("appends the packer's plugin to the packer's list", async () => {
    await expect(packed()).resolves.toMatchObject({ name: "stealth:theme.runtime(pack)" });
  });

  it("leaves what the packer's list already held in place", async () => {
    const refined = overriding().refine(PACKING, { pack: { plugins: [{ name: "kept" }] } });

    expect(refined.pack).toMatchObject({ plugins: [{ name: "kept" }, expect.any(Promise)] });
    await expect(packed({ pack: { plugins: [{ name: "kept" }] } })).resolves.toMatchObject({
      name: "stealth:theme.runtime(pack)",
    });
  });

  it("constructs the plugin when the configuration is composed and not when the layer is stated", () => {
    expect(contributed().item).toBeUndefined();
    expect(contributed().itemOf).toBeTypeOf("function");
  });

  it("builds a plugin instance per call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });

  it("passes the repository's own options through to the plugin", () => {
    expect(() => runtime({ layers: { base: "foundation" } })).not.toThrow();
  });
});
