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
  it("contributes the plugin at plugins", () => {
    expect(stylesheet().at).toBe("plugins");
  });

  it("names the layer for the call that produced it", () => {
    expect(stylesheet().name).toBe("theme.stylesheet");
  });

  it("returns a plugin named stealth:theme.stylesheet", async () => {
    await expect(item()).resolves.toMatchObject({
      enforce: "pre",
      name: "stealth:theme.stylesheet",
    });
  });

  it("defers plugin construction to itemOf when the layer is stated", () => {
    expect(stylesheet().item).toBeUndefined();
    expect(stylesheet().itemOf).toBeTypeOf("function");
  });

  it("builds a plugin instance per call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });

  it("accepts the include globs a repository declares", () => {
    expect(() => stylesheet({ include: ["app/**/*.tsx"] })).not.toThrow();
  });
});
