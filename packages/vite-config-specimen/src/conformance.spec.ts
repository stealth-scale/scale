import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-config";

import * as published from "#index.ts";

const PATTERNS = ["src/**/*.specimen.tsx"];

describe("@stealthscale/vite-config-specimen", () => {
  it("reports no violations of the config package contract", async () => {
    await expect(
      violations({
        arguments: {
          catalogue: [{ patterns: PATTERNS }],
          crawled: [PATTERNS],
          indexed: [{ patterns: PATTERNS }],
        },
        at: join(import.meta.dirname, ".."),
        kind: "config",
        module: published,
      }),
    ).resolves.toStrictEqual([]);
  });
});
