/**
 * Substitutes a package's name and version into its bundle as literal values.
 *
 * @remarks
 *   Each constant is replaced in the source text at build time and costs
 *   nothing at run time. A consumer types them against the declarations this
 *   package publishes under its `./globals` subpath.
 */

import { type UserConfig } from "vite";

import { type Context, type Override, override } from "@stealthscale/vite-config-core";

import { type Packing } from "#pack/settings.ts";

/**
 * Selects the constants injected on top of the package name and version.
 *
 * @remarks
 *   A timestamp and a commit SHA differ between two builds of the same source.
 *   Both are off unless a repository asks for them, so a build stays
 *   reproducible by default.
 */
export interface Injected {
  /**
   * Injects `__BUILT_AT__`, the time the configuration was evaluated, as an
   * ISO 8601 string.
   */
  builtAt?: boolean | undefined;

  /**
   * Injects `__COMMIT__`, the commit SHA the build ran against, read from the
   * environment.
   */
  commit?: boolean | undefined;
}

/**
 * Reads the commit SHA from whichever variable the CI runner sets.
 *
 * @remarks
 *   GitHub Actions sets `GITHUB_SHA` and GitLab CI sets `CI_COMMIT_SHA`. An
 *   environment with neither yields an empty string, so a build outside CI
 *   succeeds.
 */
function commitOf(env: Readonly<Record<string, string>>): string {
  return env["GITHUB_SHA"] ?? env["CI_COMMIT_SHA"] ?? "";
}

/**
 * Builds the constants for one context, every value JSON-encoded.
 *
 * @remarks
 *   The manifest comes from the context the composer supplies and not from disk.
 *   A field the package omits becomes an empty string. The substitution replaces
 *   source text, so an unencoded value would be spliced in as code rather than
 *   as a string.
 */
function constants(context: Context, injected: Injected): Record<string, string> {
  const held: Record<string, string> = {
    __NAME__: JSON.stringify(context.manifest.name ?? ""),
    __VERSION__: JSON.stringify(context.manifest.version ?? ""),
  };

  if (injected.commit === true) held["__COMMIT__"] = JSON.stringify(commitOf(context.env));
  if (injected.builtAt === true) held["__BUILT_AT__"] = JSON.stringify(new Date().toISOString());

  return held;
}

/**
 * Merges the constants into one packer configuration, over whatever it defines already.
 */
function packed(held: Packing | undefined, defined: Record<string, string>): Packing {
  return { ...held, define: { ...held?.define, ...defined } };
}

/**
 * Defines `__NAME__` and `__VERSION__` for both Vite and the packer, along with whichever optional
 * constants the caller asks for.
 *
 * @remarks
 *   Vite and the packer substitute separately, so the constants are written for both. A library
 *   packed with a constant Vite alone knew ships the bare identifier and throws at run time. A
 *   packer configured as an array of bundles gets the constants on every bundle, which only a
 *   layer reading the composed configuration can do.
 * @returns An override whose name lists the optional constants, so two
 *   configurations asking for different ones can be removed separately.
 */
export function manifest(injected: Injected = {}): Override {
  return override({
    because: "a package names itself and its version in what it ships, from the manifest alone",
    name: `define.manifest${asked(injected)}`,
    refine: (context, config): UserConfig => {
      const defined = constants(context, injected);

      return {
        ...config,
        define: { ...config.define, ...defined },
        pack: Array.isArray(config.pack)
          ? config.pack.map((one) => packed(one, defined))
          : packed(config.pack, defined),
      };
    },
  });
}

/**
 * Formats the chosen optional constants as a suffix for the layer's name.
 *
 * @remarks
 *   A layer is removed by name, so two layers asking for different constants
 *   need different names.
 */
function asked(injected: Injected): string {
  const held = [
    injected.commit === true ? "commit" : "",
    injected.builtAt === true ? "builtAt" : "",
  ].filter((one) => one !== "");

  return held.length === 0 ? "" : `(${held.join(", ")})`;
}
