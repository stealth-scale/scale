/**
 * Checks the transform's defaults, what a caller may change, and that the shipped tsconfig agrees.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { FACTORY, options, refresh } from "#plugin/refresh.ts";

const MDX = /\.mdx$/u;

/**
 * Reads the compiler options out of the tsconfig fragment this package publishes.
 */
function shipped(): Record<string, unknown> {
  const source = readFileSync(new URL("../../web.json", import.meta.url).pathname, "utf8");
  const held = JSON.parse(source) as { compilerOptions: Record<string, unknown> };

  return held.compilerOptions;
}

describe("refresh", () => {
  it("appends to the list of plugins rather than replacing whatever else is there", () => {
    expect(refresh().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(refresh().name).toBe("react.plugin.refresh");
  });

  it("compiles every TypeScript JavaScript and rendering-markdown file", () => {
    expect(options({}).include).toStrictEqual([/\.[tj]sx?$/u, /\.mdx$/u]);
  });

  it("adds a file kind without dropping the ones it already compiled", () => {
    const extra = /\.svelte$/u;

    expect(options({ also: [extra] }).include).toStrictEqual([/\.[tj]sx?$/u, MDX, extra]);
  });

  it("leaves the dependencies and the specimens alone and keeps doing so when more are added", () => {
    expect(options({}).exclude).toStrictEqual([/\/node_modules\//u, /\.specimen\.[tj]sx$/u]);
    expect(options({ except: [MDX] }).exclude).toStrictEqual([
      /\/node_modules\//u,
      /\.specimen\.[tj]sx$/u,
      MDX,
    ]);
  });

  it("imports the factory from React unless the repository renders through something else", () => {
    expect(options({}).jsxImportSource).toBe(FACTORY);
    expect(options({ from: "@emotion/react" }).jsxImportSource).toBe("@emotion/react");
  });

  it("compiles against the same factory the shipped tsconfig type-checks against", () => {
    expect(shipped()["jsxImportSource"] ?? FACTORY).toBe(FACTORY);
  });

  it("uses the automatic runtime", () => {
    expect(options({}).jsxRuntime).toBe("automatic");
    expect(shipped()["jsx"]).toBe("react-jsx");
  });

  it("leaves the plugin's own compiler option alone", () => {
    expect(options({})).not.toHaveProperty("compiler");
  });
});
