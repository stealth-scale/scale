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

  it("bundles every dynamic import up front", () => {
    const refined = bundled().refine(SERVING, {});

    expect(refined.build?.rolldownOptions?.experimental).toStrictEqual({
      devMode: { lazy: false },
    });
  });

  it("keeps whatever else the bundler's options held", () => {
    const refined = bundled().refine(SERVING, {
      build: { rolldownOptions: { experimental: { lazyBarrel: true }, treeshake: false } },
    });

    expect(refined.build?.rolldownOptions).toStrictEqual({
      experimental: { devMode: { lazy: false }, lazyBarrel: true },
      treeshake: false,
    });
  });

  it("leaves a specification run serving one module per file", () => {
    expect(bundled().refine({ ...SERVING, mode: "test" }, {})).toStrictEqual({});
  });

  it("leaves a build alone", () => {
    const building = { ...SERVING, command: "build", mode: "production" } as const;

    expect(bundled().refine(building, {})).toStrictEqual({});
  });

  it("names the layer for the call that produced it and says why", () => {
    expect(bundled().name).toBe("server.bundled");
    expect(bundled().because).not.toBe("");
  });
});
