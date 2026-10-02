/**
 * Checks where the MDX plugin lands in the plugin list, the compiler options it sets, and the
 * declaration file the package publishes.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { type Contribution, type Override } from "@stealthscale/vite-config";

import { mdx, options } from "#plugin/mdx.ts";
import { FACTORY } from "#plugin/refresh.ts";

/**
 * Controls whether the mocked `located` resolves, so a case can stand in for a checkout without
 * the optional peer installed.
 */
const absent = vi.hoisted(() => ({ value: false }));

vi.mock(import("@stealthscale/vite-config"), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    located: (specifier: string, from: string): string => {
      if (absent.value) throw new Error(`Cannot find module '${specifier}'`);

      return actual.located(specifier, from);
    },
  };
});

type Refining = Parameters<Override["refine"]>[0];

const HERE = new URL("../../", import.meta.url).pathname;

const CONTEXT: Refining = {
  at: HERE,
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: HERE,
};

interface Named {
  enforce?: string;
  name: string;
}

/**
 * Returns the name and phase of whatever the layer put into a plugin list, once resolved.
 */
async function named(value: unknown): Promise<Named> {
  const held: unknown = await value;

  if (typeof held !== "object" || held === null || !("name" in held)) {
    throw new Error("the plugin list holds something without a name");
  }

  return held as Named;
}

/**
 * Returns the override of the two layers `mdx()` produces.
 */
function compiled(): Override {
  const [held] = mdx();

  if (held?.kind !== "override") throw new Error("the first MDX layer is not an override");

  return held;
}

/**
 * Returns the packer contribution of the two layers `mdx()` produces.
 */
function packed(): Contribution {
  const [, held] = mdx();

  if (held?.kind !== "contribution") throw new Error("the second MDX layer is not a contribution");

  return held;
}

describe("mdx", () => {
  it("names both layers for the call that produced them", () => {
    expect(mdx().map((one) => one.name)).toStrictEqual([
      "react.plugin.mdx",
      "react.plugin.mdx(pack)",
    ]);
  });

  it("sets the pre phase on the plugin it puts first", async () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "0");

    const refined = compiled().refine(CONTEXT, { plugins: [{ name: "other" }] });
    const [first] = await Promise.all((refined.plugins ?? []).map((one) => named(one)));

    expect(first).toStrictEqual(
      expect.objectContaining({ enforce: "pre", name: "@mdx-js/rollup" }),
    );
  });

  it("keeps the plugins the list already declared after it", async () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "0");

    const refined = compiled().refine(CONTEXT, { plugins: [{ name: "other" }] });
    const [, second] = await Promise.all((refined.plugins ?? []).map((one) => named(one)));

    expect(second?.name).toBe("other");
  });

  it("adds the plugin when the config declares no plugins", () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "0");

    expect(compiled().refine(CONTEXT, {}).plugins).toHaveLength(1);
  });

  it("returns the config unchanged while the toolchain resolves for metadata alone", () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "1");

    const config = { plugins: [{ name: "other" }] };

    expect(compiled().refine(CONTEXT, config)).toBe(config);
  });

  it("contributes the plugin at pack.plugins", async () => {
    expect(packed().at).toBe("pack.plugins");
    expect(packed().item).toBeUndefined();
    await expect(named(packed().itemOf?.(CONTEXT))).resolves.toMatchObject({
      name: "@mdx-js/rollup",
    });
  });

  it("names the package to install when the compiler is not installed", async () => {
    absent.value = true;

    try {
      await expect(named(packed().itemOf?.(CONTEXT))).rejects.toThrow(
        "@mdx-js/rollup, which is an optional peer of @stealthscale/vite-config-react and is not installed",
      );
    } finally {
      absent.value = false;
    }
  });

  it("sets the format to mdx", () => {
    expect(options({}).format).toBe("mdx");
  });

  it("imports the JSX factory from React by default", () => {
    expect(options({}).jsxImportSource).toBe(FACTORY);
  });

  it("imports the JSX factory from the package the caller names", () => {
    expect(options({ from: "@emotion/react" }).jsxImportSource).toBe("@emotion/react");
  });

  it("publishes the declaration file a consumer references", () => {
    const held = JSON.parse(readFileSync(`${HERE}package.json`, "utf8")) as {
      exports: Record<string, string>;
      files: string[];
    };
    const declared = readFileSync(`${HERE}mdx.d.ts`, "utf8");

    expect(held.files).toContain("mdx.d.ts");
    expect(held.exports["./mdx"]).toBe("./mdx.d.ts");
    expect(declared).toContain('/// <reference types="mdx" />');
    expect(declared).toContain('declare module "mdx/types.js"');
  });
});
