import { describe, expect, it } from "vitest";

import { composed } from "#composed.ts";

type Context = Parameters<NonNullable<ReturnType<typeof composed>["itemOf"]>>[0];

const BUILDING: Context = {
  at: "/repository/apps/people",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

function item(): Promise<unknown> {
  return Promise.resolve(composed().itemOf?.(BUILDING));
}

describe("composed", () => {
  it("contributes at the plugins key", () => {
    expect(composed().at).toBe("plugins");
  });

  it("returns a contribution named product.composed", () => {
    expect(composed().name).toBe("product.composed");
  });

  it("returns a plugin named stealth:product", async () => {
    await expect(item()).resolves.toMatchObject({ name: "stealth:product" });
  });

  it("leaves item undefined when the layer is stated", () => {
    expect(composed().item).toBeUndefined();
  });

  it("returns a new plugin instance for each call", async () => {
    await expect(item()).resolves.not.toBe(await item());
  });

  it("states the reason in because", () => {
    expect(composed().because).toContain("virtual:product");
  });
});
