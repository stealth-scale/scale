import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Layer, lint } from "@stealthscale/vite-config";

import { contract, web } from "#lint/plugin.ts";

/**
 * Describes the override one layer contributes.
 */
interface Override {
  readonly excludeFiles?: readonly string[];
  readonly files: readonly string[];
  readonly rules: {
    readonly "no-restricted-imports": readonly [
      string,
      {
        readonly patterns: ReadonlyArray<{
          readonly group: readonly string[];
          readonly importNamePattern?: string;
          readonly message: string;
        }>;
      },
    ];
  };
}

/**
 * Returns the override a layer contributes.
 */
function overrideOf(layer: Layer | undefined): Override {
  return (layer !== undefined && "item" in layer ? layer.item : undefined) as Override;
}

/**
 * Returns the groups of every pattern of an override.
 */
function groupsOf(layer: Layer | undefined): ReadonlyArray<readonly string[]> {
  return overrideOf(layer).rules["no-restricted-imports"][1].patterns.map(({ group }) => group);
}

/**
 * Returns every specifier the house's node preset refuses through `no-restricted-imports`.
 */
function houseRefused(): readonly string[] {
  const [preset] = lint.preset.node();
  const config = (preset !== undefined && "config" in preset ? preset.config : {}) as UserConfig;
  const stated: unknown = config.lint?.rules?.["no-restricted-imports"];
  const [, options] = stated as [
    string,
    {
      readonly paths: ReadonlyArray<{ readonly name: string }>;
      readonly patterns: ReadonlyArray<{ readonly group: readonly string[] }>;
    },
  ];

  return [
    ...options.paths.map(({ name }) => name),
    ...options.patterns.flatMap(({ group }) => group),
  ];
}

describe("plugin", () => {
  it("names the contract package's layer for the call", () => {
    expect(contract().name).toBe("product.lint.plugin.contract");
  });

  it("covers a contract package's sources without its specifications", () => {
    expect(overrideOf(contract())).toMatchObject({
      excludeFiles: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.fixtures.ts", "**/*.fixtures.tsx"],
      files: ["**/src/**"],
    });
  });

  it("refuses every import to a contract but the ones it re-admits", () => {
    expect(groupsOf(contract())).toStrictEqual([
      [
        "*",
        "!@stealthscale/sdk-core",
        "!@standard-schema/spec",
        "!*-contract",
        "!#*",
        "!#*/**",
        "!./*",
        "!./**",
        "!arktype",
        "!arktype/*",
        "!valibot",
        "!valibot/*",
        "!zod",
        "!zod/*",
      ],
    ]);
  });

  it("re-admits the Standard Schema libraries the options name", () => {
    expect(groupsOf(contract({ schemas: ["effect"] }))[0]?.slice(-2)).toStrictEqual([
      "!effect",
      "!effect/*",
    ]);
  });

  it("names the web package's layers for the call", () => {
    expect(web().map(({ name }) => name)).toStrictEqual([
      "product.lint.plugin.web.sources",
      "product.lint.plugin.web.manifest",
    ]);
  });

  it("refuses the host package to a web package's sources without its specifications", () => {
    const [sources] = web();

    expect(overrideOf(sources)).toMatchObject({
      excludeFiles: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.fixtures.ts", "**/*.fixtures.tsx"],
      files: ["**/src/**"],
    });
    expect(groupsOf(sources)[1]).toStrictEqual([
      "@stealthscale/sdk-host",
      "@stealthscale/sdk-host/*",
    ]);
  });

  it("refuses a static import of a component module to the manifest entry", () => {
    const [, manifest] = web();

    expect(overrideOf(manifest).files).toStrictEqual(["**/src/manifest.ts"]);
    expect(overrideOf(manifest).rules["no-restricted-imports"][1].patterns[2]).toMatchObject({
      group: ["*.tsx"],
      importNamePattern: ".*",
    });
  });

  it("restates the refusals of the sources in the manifest entry's override", () => {
    const [sources, manifest] = web();

    expect(groupsOf(manifest).slice(0, 2)).toStrictEqual(groupsOf(sources));
  });

  it("covers the manifest entry the options name", () => {
    const [, manifest] = web({ manifest: "src/index.ts" });

    expect(overrideOf(manifest).files).toStrictEqual(["**/src/index.ts"]);
  });

  it("restates every specifier the house refuses in each web override", () => {
    const [sources, manifest] = web();

    expect([groupsOf(sources)[0], groupsOf(manifest)[0]]).toStrictEqual([
      houseRefused(),
      houseRefused(),
    ]);
  });
});
