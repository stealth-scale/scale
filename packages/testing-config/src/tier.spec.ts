import { describe, expect, it } from "vitest";

import { type Layer } from "#layers.ts";
import { composes } from "#tier.ts";

const PUBLISHED = {
  exports: { ".": "./dist/index.mjs", "./preset/app": "./dist/app.mjs" },
  name: "x",
};

const LAYER: Layer = { kind: "preset", name: "test.files" };

function composing(): Promise<object> {
  return Promise.resolve({ test: {} });
}

function failing(): never {
  throw new Error("no manifest");
}

function stringly(): string {
  return "x";
}

function strayLayers(): unknown[] {
  return [LAYER, "x"];
}

function doubledLayers(): unknown[] {
  return [LAYER, LAYER];
}

function stringDefiner(): () => string {
  return stringly;
}

function failingDefiner(): () => never {
  return failing;
}

const TIER = {
  defineConfig: (): (() => Promise<object>) => composing,
  layers: (): unknown[] => [LAYER, [{ kind: "preset", name: "lint.node" }]],
};

function checked(tier: Record<string, unknown>): Promise<readonly string[]> {
  return composes(PUBLISHED, { "preset/app": tier }, "/x");
}

describe("composes", () => {
  it("accepts a tier that exports both functions and composes under a build", async () => {
    await expect(checked(TIER)).resolves.toStrictEqual([]);
  });

  it("accepts a manifest without a tier", async () => {
    await expect(composes({ name: "x" }, {}, "/x")).resolves.toStrictEqual([]);
  });

  it("reports a published tier the specification does not supply", async () => {
    await expect(composes(PUBLISHED, {}, "/x")).resolves.toStrictEqual([
      "preset/app is exported and not given to tiers",
    ]);
  });

  it("reports a tier without layers", async () => {
    await expect(checked({ defineConfig: TIER.defineConfig })).resolves.toStrictEqual([
      "preset/app exports no layers()",
    ]);
  });

  it("reports a tier without defineConfig", async () => {
    await expect(checked({ layers: TIER.layers })).resolves.toStrictEqual([
      "preset/app exports no defineConfig",
    ]);
  });

  it("reports a tier that composes something other than a layer", async () => {
    await expect(checked({ ...TIER, layers: strayLayers })).resolves.toStrictEqual([
      "preset/app composes something that is not a layer",
    ]);
  });

  it("reports a tier that composes one layer twice", async () => {
    await expect(checked({ ...TIER, layers: doubledLayers })).resolves.toStrictEqual([
      "preset/app composes twice a layer named test.files",
    ]);
  });

  it("reports a defineConfig that returns something other than a function", async () => {
    await expect(checked({ ...TIER, defineConfig: composing })).resolves.toStrictEqual([
      "preset/app defineConfig returns something other than a function of the environment",
    ]);
  });

  it("reports a config function that resolves to something other than a config", async () => {
    await expect(checked({ ...TIER, defineConfig: stringDefiner })).resolves.toStrictEqual([
      "preset/app composes to something other than a config",
    ]);
  });

  it("reports the message when composing throws", async () => {
    await expect(checked({ ...TIER, defineConfig: failingDefiner })).resolves.toStrictEqual([
      "preset/app fails to compose under a build: no manifest",
    ]);
  });
});
