/**
 * Covers the contribution an application extends its tier with.
 */

import { describe, expect, it } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { stylesheet } from "#stylesheet.ts";

const BUILDING: Context = {
  at: "/repository/apps/docs",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

function item(): Promise<unknown> {
  return Promise.resolve(stylesheet().itemOf?.(BUILDING));
}

describe("stylesheet", () => {
  it("appends to the list of plugins rather than replacing whatever else is there", () => {
    expect(stylesheet().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(stylesheet().name).toBe("theme.stylesheet");
  });

  it("carries the stylesheet plugin under its house name", async () => {
    await expect(item()).resolves.toMatchObject({
      enforce: "pre",
      name: "stealth:theme.stylesheet",
    });
  });

  it("constructs the plugin when the configuration is composed and not when the layer is stated", () => {
    expect(stylesheet().item).toBeUndefined();
    expect(stylesheet().itemOf).toBeTypeOf("function");
  });

  it("builds a plugin instance per call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });

  it("passes the repository's own options through to the plugin", () => {
    expect(() => stylesheet({ include: ["app/**/*.tsx"] })).not.toThrow();
  });
});
