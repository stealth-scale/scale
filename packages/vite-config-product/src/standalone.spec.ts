import { type ConfigEnv, type Plugin } from "vite";
import { describe, expect, it } from "vitest";

import { type Layer } from "@stealthscale/vite-config";

import { standalone } from "#standalone.ts";

type Context = Parameters<NonNullable<Extract<Layer, { kind: "contribution" }>["itemOf"]>>[0];

const SERVED = ["product.standalone", "product.standalone.stylesheet", "product.standalone.chunks"];

const SERVING: Context = {
  at: "/repository/plugins/time-off",
  command: "serve",
  env: {},
  manifest: {},
  mode: "development",
  root: "/repository",
};

function layerOf(name: string, options = {}): Layer {
  const found = standalone(options).find((layer) => layer.name === name);

  if (found === undefined) throw new Error(`standalone() returns no layer named ${name}.`);

  return found;
}

function appliesIn(name: string, env: ConfigEnv): boolean {
  const { apply } = layerOf(name);

  return typeof apply === "function" && apply(env);
}

async function pluginOf(name: string, options = {}): Promise<Plugin> {
  const layer = layerOf(name, options);
  const item: unknown = layer.kind === "contribution" ? await layer.itemOf?.(SERVING) : undefined;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- both contributions build a Vite plugin
  return item as Plugin;
}

function resolvedBy(plugin: Plugin, id: string): unknown {
  const hook: unknown = plugin.resolveId;

  return typeof hook === "function"
    ? Reflect.apply(hook, undefined, [id, undefined, {}])
    : undefined;
}

describe("standalone", () => {
  it("names each layer for the call that built it", () => {
    expect(standalone().map((layer) => layer.name)).toStrictEqual([
      "product.standalone",
      "product.standalone.stylesheet",
      "product.standalone.chunks",
      "product.standalone.bundled",
    ]);
  });

  it("excuses the definition module the options name from the default export rule", () => {
    const layer = layerOf("product.standalone.definition", { definition: "src/standalone.ts" });

    expect(layer.kind === "contribution" ? layer.item : undefined).toStrictEqual({
      files: ["**/src/standalone.ts"],
      rules: { "no-default-export": "off" },
    });
  });

  it.each(SERVED)("applies %s under a dev server", (name) => {
    expect(appliesIn(name, { command: "serve", mode: "development" })).toBe(true);
  });

  it.each(SERVED)("leaves %s out of a build", (name) => {
    expect(appliesIn(name, { command: "build", mode: "production" })).toBe(false);
  });

  it.each(SERVED)("leaves %s out of a specification run", (name) => {
    expect(appliesIn(name, { command: "serve", mode: "test" })).toBe(false);
  });

  it("places each module of the page by its path alone", () => {
    const layer = layerOf("product.standalone.chunks");
    const config = layer.kind === "override" ? layer.refine(SERVING, {}) : {};
    const output = config.build?.rolldownOptions?.output;
    const splitting = Array.isArray(output) ? undefined : output?.codeSplitting;

    expect(typeof splitting === "object" && splitting.includeDependenciesRecursively).toBe(false);
  });

  it("returns the product plugin with the standalone page", async () => {
    const plugin = await pluginOf("product.standalone");

    expect(resolvedBy(plugin, "virtual:standalone")).toBe("\0virtual:standalone");
  });

  it("returns the stylesheet compiler", async () => {
    await expect(pluginOf("product.standalone.stylesheet")).resolves.toMatchObject({
      name: "stealth:theme.stylesheet",
    });
  });

  it("bundles the page under a dev server", () => {
    const layer = layerOf("product.standalone.bundled");
    const config = layer.kind === "override" ? layer.refine(SERVING, {}) : {};

    expect(config.experimental?.bundledDev).toBe(true);
  });

  it("states the reason for the standalone page in because", () => {
    const layer = layerOf("product.standalone");

    expect(layer.kind === "contribution" ? layer.because : "").toContain("standalone page");
  });
});
