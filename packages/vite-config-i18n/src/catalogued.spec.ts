import { describe, expect, it } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { catalogued } from "#catalogued.ts";

const BUILDING: Context = {
  at: "/repository/apps/docs",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

function item(): Promise<unknown> {
  return Promise.resolve(catalogued().itemOf?.(BUILDING));
}

describe("catalogued", () => {
  it("appends to plugins rather than replacing them", () => {
    expect(catalogued().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(catalogued().name).toBe("i18n.catalogued");
  });

  it("carries the plugin under its house name", async () => {
    await expect(item()).resolves.toMatchObject({ name: "stealth:i18n" });
  });

  it("constructs the plugin when the configuration is composed and not when the layer is stated", () => {
    expect(catalogued().item).toBeUndefined();
  });

  it("builds a plugin instance per call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });

  it("passes the options through to the plugin", () => {
    expect(() => catalogued({ fallback: "nl" })).not.toThrow();
  });

  it("states why the plugin is there", () => {
    expect(catalogued().because).toContain("catalogue");
  });
});
