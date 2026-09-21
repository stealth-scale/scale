/**
 * Runs this package through the contract every config package in the repository keeps.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-config-theme", () => {
  it("breaks no rule of the config package contract", async () => {
    await expect(
      violations({
        arguments: { runtime: [], stylesheet: [] },
        at: join(import.meta.dirname, ".."),
        kind: "config",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
