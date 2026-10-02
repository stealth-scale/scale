/**
 * Checks this package's directory and published module against the contract every plugin package
 * in the repository keeps.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-plugin-product", () => {
  it("reports no violations of the plugin package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "plugin",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
