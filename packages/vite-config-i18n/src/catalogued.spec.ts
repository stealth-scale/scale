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
  it("contributes at the plugins key", () => {
    expect(catalogued().at).toBe("plugins");
  });

  it("returns a contribution named i18n.catalogued", () => {
    expect(catalogued().name).toBe("i18n.catalogued");
  });

  it("returns a plugin named stealth:i18n", async () => {
    await expect(item()).resolves.toMatchObject({ name: "stealth:i18n" });
  });

  it("leaves item undefined when the layer is stated", () => {
    expect(catalogued().item).toBeUndefined();
  });

  it("returns a new plugin instance for each call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });

  it("accepts a fallback language in the options", () => {
    expect(() => catalogued({ fallback: "nl" })).not.toThrow();
  });

  it("sets because to a reason naming the catalogue", () => {
    expect(catalogued().because).toContain("catalogue");
  });
});
