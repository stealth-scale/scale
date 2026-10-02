import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

describe("@stealthscale/component-a11y", () => {
  it("reports no violation against the library package contract", async () => {
    await expect(
      violations({
        at: join(import.meta.dirname, ".."),
        barrels: true,
        kind: "library",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
