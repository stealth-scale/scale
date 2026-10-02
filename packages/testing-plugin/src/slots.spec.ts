import { describe, expect, it } from "vitest";

import { caseNamed } from "#checks.fixtures.ts";
import { SHOP } from "#shop-manifest.fixtures.ts";
import { slotCases } from "#slots.ts";

describe("slotCases", () => {
  it("names one case per slot the plugin declares", () => {
    expect(slotCases(SHOP).map(({ name }) => name)).toStrictEqual([
      "slot shop/aisle is mounted by the plugin",
      "slot shop/unused is mounted by the plugin",
    ]);
  });

  it("passes a slot a route of the plugin mounts at its sample", async () => {
    const found = caseNamed(slotCases(SHOP), "slot shop/aisle is mounted by the plugin");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a slot no route or extension of the plugin mounts", async () => {
    const found = caseNamed(slotCases(SHOP), "slot shop/unused is mounted by the plugin");

    await expect(found.run()).rejects.toThrow(
      "No route or extension of shop mounts the slot shop/unused.",
    );
  });

  it("shares one walk between the cases of one call", async () => {
    const cases = slotCases(SHOP);
    const results = await Promise.allSettled(cases.map(({ run }) => run()));

    expect(results.map(({ status }) => status)).toStrictEqual(["fulfilled", "rejected"]);
  });
});
