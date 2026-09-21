/**
 * Checks this package against the contract every library package in the repository keeps.
 *
 * @remarks
 *   `violations` reads the manifest, the published entry point and the files that ship, so a
 *   package cannot pass its own specifications and still be unusable once installed.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/pandacss-naming", () => {
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
