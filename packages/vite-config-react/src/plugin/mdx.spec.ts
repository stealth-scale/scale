/**
 * Checks where the MDX plugin lands, what it compiles, and that the published declarations agree.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { type Contribution, type Override } from "@stealthscale/vite-config";

import { mdx, options } from "#plugin/mdx.ts";
import { FACTORY } from "#plugin/refresh.ts";

/**
 * Whether the compiler package is to be found, which a case flips to stand for a checkout without
 * the optional peer.
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
 * Reads the plugin name and phase off whatever the layer put into a plugin list, once settled.
 */
async function named(value: unknown): Promise<Named> {
  const held: unknown = await value;

  if (typeof held !== "object" || held === null || !("name" in held)) {
    throw new Error("the plugin list holds something without a name");
  }

  return held as Named;
}

/**
 * Takes the override out of the pair the layer returns.
 */
function compiled(): Override {
  const [held] = mdx();

  if (held?.kind !== "override") throw new Error("the first MDX layer is not an override");

  return held;
}

/**
 * Takes the packer's contribution out of the pair the layer returns.
 */
function packed(): Contribution {
  const [, held] = mdx();

  if (held?.kind !== "contribution") throw new Error("the second MDX layer is not a contribution");

  return held;
}

describe("mdx", () => {
  it("names both layers for the call a consumer wrote", () => {
    expect(mdx().map((one) => one.name)).toStrictEqual([
      "react.plugin.mdx",
      "react.plugin.mdx(pack)",
    ]);
  });

  it("puts the plugin ahead of whatever plugins the tree built and in the pre phase", async () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "0");

    const refined = compiled().refine(CONTEXT, { plugins: [{ name: "other" }] });
    const [first, second] = await Promise.all((refined.plugins ?? []).map((one) => named(one)));

    expect(first).toStrictEqual(
      expect.objectContaining({ enforce: "pre", name: "@mdx-js/rollup" }),
    );
    expect(second?.name).toBe("other");
  });

  it("puts the plugin first when the tree built none", () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "0");

    expect(compiled().refine(CONTEXT, {}).plugins).toHaveLength(1);
  });

  it("constructs nothing while the toolchain reads the configuration for its metadata", () => {
    vi.stubEnv("VP_RESOLVING_CONFIG_METADATA", "1");

    const config = { plugins: [{ name: "other" }] };

    expect(compiled().refine(CONTEXT, config)).toBe(config);
  });

  it("appends to the packer's plugins rather than replacing them", async () => {
    expect(packed().at).toBe("pack.plugins");
    expect(packed().item).toBeUndefined();
    await expect(named(packed().itemOf?.(CONTEXT))).resolves.toMatchObject({
      name: "@mdx-js/rollup",
    });
  });

  it("says which package to install where the compiler is not installed", async () => {
    absent.value = true;

    try {
      await expect(named(packed().itemOf?.(CONTEXT))).rejects.toThrow(
        "@mdx-js/rollup, which is an optional peer of @stealthscale/vite-config-react and is not installed",
      );
    } finally {
      absent.value = false;
    }
  });

  it("compiles .mdx and leaves markdown alone", () => {
    expect(options({}).format).toBe("mdx");
  });

  it("imports the factory from React unless the repository renders through something else", () => {
    expect(options({}).jsxImportSource).toBe(FACTORY);
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
