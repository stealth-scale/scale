/**
 * Checks this package against the contract every published library in the repository meets.
 *
 * @remarks
 *   The manifest and the entry point are checked together, so an export the package declares but
 *   does not deliver fails here rather than in the first consumer to install it.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-plugin-base", () => {
  it("reports no violations of the library package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        kind: "library",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
