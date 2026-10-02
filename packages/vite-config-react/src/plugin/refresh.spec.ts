/**
 * Checks the React plugin defaults, the caller overrides and the agreement with the shipped
 * tsconfig.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { FACTORY, options, refresh } from "#plugin/refresh.ts";

const MDX = /\.mdx$/u;

const EXCLUDED = [/\/node_modules\//u, /\.specimen\.[tj]sx$/u, /\.example\.tsx$/u];

/**
 * Returns the compiler options of the published `web.json`.
 */
function shipped(): Record<string, unknown> {
  const source = readFileSync(new URL("../../web.json", import.meta.url).pathname, "utf8");
  const held = JSON.parse(source) as { compilerOptions: Record<string, unknown> };

  return held.compilerOptions;
}

describe("refresh", () => {
  it("contributes to the plugins key", () => {
    expect(refresh().at).toBe("plugins");
  });

  it("names the layer react.plugin.refresh", () => {
    expect(refresh().name).toBe("react.plugin.refresh");
  });

  it("includes TypeScript JavaScript and MDX files by default", () => {
    expect(options({}).include).toStrictEqual([/\.[tj]sx?$/u, /\.mdx$/u]);
  });

  it("appends the patterns passed as also to the default includes", () => {
    const extra = /\.svelte$/u;

    expect(options({ also: [extra] }).include).toStrictEqual([/\.[tj]sx?$/u, MDX, extra]);
  });

  it("excludes node_modules specimen files and example files by default", () => {
    expect(options({}).exclude).toStrictEqual(EXCLUDED);
  });

  it("appends the patterns passed as except to the default exclusions", () => {
    expect(options({ except: [MDX] }).exclude).toStrictEqual([...EXCLUDED, MDX]);
  });

  it("imports the JSX factory from react by default", () => {
    expect(options({}).jsxImportSource).toBe(FACTORY);
  });

  it("imports the JSX factory from the package passed as from", () => {
    expect(options({ from: "@emotion/react" }).jsxImportSource).toBe("@emotion/react");
  });

  it("matches the JSX factory of the shipped web.json", () => {
    expect(shipped()["jsxImportSource"] ?? FACTORY).toBe(FACTORY);
  });

  it("uses the automatic JSX runtime in the plugin and in web.json", () => {
    expect(options({}).jsxRuntime).toBe("automatic");
    expect(shipped()["jsx"]).toBe("react-jsx");
  });

  it("does not set the compiler option", () => {
    expect(options({})).not.toHaveProperty("compiler");
  });
});
