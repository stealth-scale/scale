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
  it("returns a layer named specimen.indexed", () => {
    expect(indexed({ patterns: PATTERNS }).name).toBe("specimen.indexed");
  });

  it("contributes at the plugins key", () => {
    expect(indexed({ patterns: PATTERNS }).at).toBe("plugins");
  });

  it("returns a layer with a non-empty because", () => {
    expect(indexed({ patterns: PATTERNS }).because).not.toBe("");
  });

  it("resolves the item to a plugin named stealth:specimens", async () => {
    await expect(item()).resolves.toMatchObject({ name: "stealth:specimens" });
  });

  it("leaves item undefined when the layer is stated", () => {
    expect(indexed({ patterns: PATTERNS }).item).toBeUndefined();
  });

  it("returns a different plugin instance on each call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });
});
