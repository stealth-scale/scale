import { describe, expect, it } from "vitest";

import { type Override } from "@stealthscale/vite-config-core";

import { bundled } from "#server/bundled.ts";

type Refining = Parameters<Override["refine"]>[0];

const HERE = new URL("../../", import.meta.url).pathname;

const SERVING: Refining = {
  at: HERE,
  command: "serve",
  env: {},
  manifest: {},
  mode: "development",
  root: HERE,
};

describe("bundled", () => {
  it("turns the bundling dev server on", () => {
    expect(bundled().refine(SERVING, {}).experimental?.bundledDev).toBe(true);
  });

  it("keeps whatever else the experimental key held", () => {
    const refined = bundled().refine(SERVING, { experimental: { hmrPartialAccept: true } });

    expect(refined.experimental).toStrictEqual({ bundledDev: true, hmrPartialAccept: true });
  });

  it("leaves a specification run serving one module per file", () => {
    expect(bundled().refine({ ...SERVING, mode: "test" }, {})).toStrictEqual({});
  });

  it("names the layer for the call that produced it and says why", () => {
    expect(bundled().name).toBe("server.bundled");
    expect(bundled().because).not.toBe("");
  });
});
