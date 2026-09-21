/**
 * Checks this package against the library contract every published package in the repository
 * meets.
 *
 * @remarks
 *   The checks read the manifest on disk, the README and the exported module. Running them here
 *   means a package that breaks the contract fails in its own specification run rather than at
 *   install time, in someone else's repository.
 */

import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/testing", () => {
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
