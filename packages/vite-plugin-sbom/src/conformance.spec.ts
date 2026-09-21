/**
 * Checks this package against the contract every plugin package in the repository meets.
 *
 * @remarks
 *   The checks cover the manifest, the published entry point and the files that ship, so a package
 *   cannot pass its own tests while being unusable once installed.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/vite-plugin-sbom", () => {
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
