import { describe, expect, it } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { indexed } from "#indexed.ts";

const PATTERNS = ["src/**/*.specimen.tsx"];

const BUILDING: Context = {
  at: "/repository/apps/docs",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

function item(): Promise<unknown> {
  return Promise.resolve(indexed({ patterns: PATTERNS }).itemOf?.(BUILDING));
}

describe("indexed", () => {
  it("names the layer for the call that built it", () => {
    expect(indexed({ patterns: PATTERNS }).name).toBe("specimen.indexed");
  });

  it("appends the plugin to the plugins key", () => {
    expect(indexed({ patterns: PATTERNS }).at).toBe("plugins");
  });

  it("states why the layer exists", () => {
    expect(indexed({ patterns: PATTERNS }).because).not.toBe("");
  });

  it("contributes the specimen plugin", async () => {
    await expect(item()).resolves.toMatchObject({ name: "stealth:specimens" });
  });

  it("constructs the plugin when the configuration is composed and not when the layer is stated", () => {
    expect(indexed({ patterns: PATTERNS }).item).toBeUndefined();
  });

  it("builds one plugin instance per call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });
});
