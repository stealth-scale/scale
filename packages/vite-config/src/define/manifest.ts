/**
 * Compiles a package's own identity into its bundle as literal values.
 *
 * @remarks
 *   Each constant is substituted textually at build time and costs nothing at
 *   run time. A consumer types them against the declarations this package
 *   publishes under its `./globals` subpath.
 */

import { type UserConfig } from "vite";

import { type Context, type Override, override } from "@stealthscale/vite-config-core";

import { type Packing } from "#pack/settings.ts";

/**
 * Selects which constants are injected beyond the package name and version.
 *
 * @remarks
 *   Both are off unless asked for. A timestamp and a revision each differ
 *   between two builds of the same source, so a repository that needs a
 *   reproducible build opts out by leaving them alone.
 */
export interface Injected {
  /**
   * Injects the moment the configuration was evaluated, as an ISO 8601 string.
   */
  builtAt?: boolean | undefined;

  /**
   * Injects the revision the build ran against, taken from the environment.
   */
  commit?: boolean | undefined;
}

/**
 * Reads the revision from whichever variable the runner happens to set.
 *
 * @remarks
 *   GitHub Actions and GitLab CI spell the variable differently, and a
 *   workstation sets neither. An unset environment yields an empty string rather
 *   than an error, so building outside CI still works.
 */
function commitOf(env: Readonly<Record<string, string>>): string {
  return env["GITHUB_SHA"] ?? env["CI_COMMIT_SHA"] ?? "";
}

/**
 * Writes the constants for one context, every value JSON-encoded.
 *
 * @remarks
 *   The manifest comes from the context the composer supplies rather than from
 *   disk, and a field the package omits becomes an empty string. Every value is
 *   JSON-encoded, because the substitution replaces source text.
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
 * Writes the constants into one packer configuration, over whatever it defines already.
 */
function packed(held: Packing | undefined, defined: Record<string, string>): Packing {
  return { ...held, define: { ...held?.define, ...defined } };
}

/**
 * Injects the package name and version, along with whatever else was asked for.
 *
 * @remarks
 *   The constants are written for Vite and for the packer both, because the two substitute
 *   separately: a library packed with a constant Vite alone knew would ship the bare name and
 *   throw at run time. A packer configured as a list of bundles gets the constants on every
 *   bundle. An override rather than a preset, because the packer's list is mapped over rather than
 *   merged into.
 * @returns An override whose name lists the optional constants, so two
 *   configurations asking for different ones stay separately removable.
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
 * Spells the chosen constants out as a suffix for the layer's name.
 *
 * @remarks
 *   A layer is taken back by name, so two of them asking for different constants
 *   have to end up with different names. Choosing none adds no suffix, leaving
 *   the plain name a repository would guess at.
 */
function asked(injected: Injected): string {
  const held = [
    injected.commit === true ? "commit" : "",
    injected.builtAt === true ? "builtAt" : "",
  ].filter((one) => one !== "");

  return held.length === 0 ? "" : `(${held.join(", ")})`;
}
